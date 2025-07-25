"use client";

import React, { createContext, useState, useEffect } from "react"
import { NotificationUtil } from '../utils/notification';
import { AuthUtil } from '../utils/auth';
import { GDriveUserInfo, GDriveUtil } from "../utils/gdrive";

interface AuthContextInterface {
  authError: any;
  doAuth: (code: string) => Promise<any>;
  doLogout: () => Promise<void>;
  goToAuth: () => void;
  isAuthOk: boolean;
  isLoadingAuth: boolean;
  loadRefreshIfExists: (refreshTokenToSet?: string) => Promise<{ success: boolean, refreshToken?: string, message?: string }>;
  userInfo?: GDriveUserInfo
}

const AuthContext = createContext<AuthContextInterface>({
  authError: null,
  doAuth: Promise.reject,
  doLogout: Promise.reject,
  goToAuth: Promise.reject,
  isAuthOk: false,
  isLoadingAuth: true,
  loadRefreshIfExists: Promise.reject,
  userInfo: null,
});

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_API_KEY || '';

if (!CLIENT_ID || !CLIENT_SECRET)
  throw new Error("You must set env variables")

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';
const GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
const redirectUrl = `${process.env.NEXT_PUBLIC_URL}/auth/redirect`;

export function AuthProvider(props: any) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthOk, setIsAuthOk] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<GDriveUserInfo>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoadingAuth(true);
    console.debug("Loading auth state...");
    await loadTokenOrRefreshIfExists();
    await loadUserInfoIfNeed();
    setIsLoadingAuth(false);
  }

  async function loadUserInfoIfNeed() {
    const isLoggedIn = AuthUtil.isAuthOk();

    if (!isLoggedIn) {
      console.debug('User is not logged in, skipping user info load');
      setUserInfo(null);
      return;
    }

    const cachedUserInfo = AuthUtil.getUserInfo() as GDriveUserInfo;

    if (cachedUserInfo) {
      console.debug('Using cached user info:', cachedUserInfo);
      setUserInfo(cachedUserInfo);
      return;
    }

    console.debug('Loading user info from GDrive Api...');

    const userInfo = await GDriveUtil.getUserInfo();
    console.debug('loadedUserInfo', userInfo);

    AuthUtil.setUserInfo(userInfo);
    setUserInfo(userInfo);
  }

  async function loadTokenOrRefreshIfExists() {
    console.debug("Checking for existing token or refresh token...");
    const token = AuthUtil.getAuthToken();

    if (token) {
      console.debug("Token found, setting auth state to OK");
      setIsAuthOk(true);
    } else {
      console.debug("No token found, checking for refresh token...");
      await loadRefreshIfExists();
    }
  }

  async function loadRefreshIfExists(refreshTokenToSet?: string) {
    let message = "No valid token or refresh token found";
    const refreshToken = refreshTokenToSet ?? await AuthUtil.getRefreshToken();
    const authToken = AuthUtil.getAuthToken();
    let isOk = !!authToken;

    if (typeof refreshToken === 'string' && refreshToken.length > 0 && authToken == null) {
      console.debug("Refresh token found, attempting to refresh access token...");
      isOk = await doRefresh(refreshToken);
    }

    if (isOk) {
      message = "Token refreshed successfully";
      await AuthUtil.setRefreshTokenIfNeed(refreshToken);
      console.debug(`${message}, setting auth state to OK`);
      setIsAuthOk(true);
      setAuthError(null);
    } else {
      console.debug(`${message}, setting auth state to not OK`);
      setIsAuthOk(false);
      setAuthError(message);
      AuthUtil.clearAuthToken();
      AuthUtil.clearUserInfo();
      await AuthUtil.clearRefreshToken();
    }

    return { success: isOk, refreshToken, message };
  }

  function goToAuth() {
    const googleAuthUrl = new URL(GOOGLE_AUTH_BASE_URL)

    googleAuthUrl.searchParams.set('client_id', CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUrl);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', SCOPES);
    googleAuthUrl.searchParams.set('access_type', 'offline');

    window.location.href = googleAuthUrl.toString();
  }

  async function doAuth(code: string) {
    setIsLoadingAuth(true);
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();

    urlencoded.append("code", code);
    urlencoded.append("client_id", CLIENT_ID);
    urlencoded.append("client_secret", CLIENT_SECRET);
    urlencoded.append("redirect_uri", redirectUrl);
    urlencoded.append("grant_type", "authorization_code");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch("https://oauth2.googleapis.com/token", requestOptions)
    const responseData = await response.json();

    if (!response.ok) {
      console.error("Failed to authenticate:", responseData);
      setIsLoadingAuth(false);
      setAuthError(responseData.error || "Failed to authenticate");

      throw new Error(responseData.error || "Failed to authenticate");
    }

    console.debug("doAuth response:", responseData);

    await AuthUtil.setAuthToken(responseData.access_token, responseData.expires_in)
    await AuthUtil.setRefreshTokenIfNeed(responseData.refresh_token);

    setIsLoadingAuth(false);
    NotificationUtil.send("Autenticação realizada com sucesso");

    return responseData;
  }

  async function doRefresh(refresh: string) {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();

    // https://developers.google.com/identity/protocols/oauth2/web-server#offline
    urlencoded.append("refresh_token", refresh);
    urlencoded.append("client_id", CLIENT_ID);
    urlencoded.append("client_secret", CLIENT_SECRET);
    urlencoded.append("grant_type", "refresh_token");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch("https://oauth2.googleapis.com/token", requestOptions)

    if (!response.ok)
      return false;

    const responseData = await response.json();

    await AuthUtil.setAuthToken(responseData.access_token, responseData.expires_in);

    setIsLoadingAuth(false);
    NotificationUtil.send("Autenticação realizada com sucesso");

    return responseData;
  }

  async function doLogout() {
    // revoke access token
    // https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
    setIsLoadingAuth(true);
    const currentToken = AuthUtil.getAuthToken();
    const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${currentToken}`;
    const requestOptions = { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", }, };
    const response = await fetch(revokeUrl, requestOptions)

    if (response.ok) {
      console.debug("Access token revoked successfully");

      // Clear cookies and local storage
      AuthUtil.clearAuthToken();
      AuthUtil.clearUserInfo();
      await AuthUtil.clearRefreshToken();
      setIsAuthOk(false);
      setAuthError(null);
      setIsLoadingAuth(false);
      NotificationUtil.send("Logout realizado com sucesso");
    } else {
      console.debug("Failed to revoke access token:", response, response.statusText);
      setIsLoadingAuth(false);
      setAuthError("Failed to revoke access token");
      throw new Error("Failed to revoke access token");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authError,
        doAuth,
        doLogout,
        goToAuth,
        isAuthOk,
        isLoadingAuth,
        loadRefreshIfExists,
        userInfo,
      }}
      {...props}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)