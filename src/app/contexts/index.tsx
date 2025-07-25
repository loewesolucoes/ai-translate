"use client";
import React from "react"

import { EnvProvider } from "./env"
import { AuthProvider } from "./auth"
import { StorageProvider } from "./storage"
import { LoggingProvider } from "./logging"
import { LocationProvider } from "./location";
import { NotificationProvider } from "./notification";
import { ThemeProvider } from "./theme";
import { ErrorHandlerProvider } from "./error-handler";
import { AiProvider } from "./ai";

export function AppProviders({ children }: any) {
  return (
    <ErrorHandlerProvider>
      <EnvProvider>
        <NotificationProvider>
          <LocationProvider>
            <LoggingProvider>
              <AuthProvider>
                <StorageProvider>
                  <AiProvider>
                    <ThemeProvider>
                      {children}
                    </ThemeProvider>
                  </AiProvider>
                </StorageProvider>
              </AuthProvider>
            </LoggingProvider>
          </LocationProvider>
        </NotificationProvider>
      </EnvProvider>
    </ErrorHandlerProvider>
  )
}