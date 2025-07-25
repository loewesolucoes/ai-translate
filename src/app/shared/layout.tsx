"use client";

import { AppProviders } from "../contexts";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import "moment/locale/pt-br";
import moment from "moment";

import { BottomNavbar } from "../components/bottom-navbar";
import { Notifications } from "../components/notifications";
import { ErrorHandler } from "./error-handler";
import { HeaderSidebar } from "../components/header-sidebar";

moment().locale('pt-br')

export function Layout({ children, noHeader }: any) {
  return (
    <ErrorHandler noHeader={noHeader}>
      <AppProviders>
        {noHeader ? null : <Header />}
        <div className="d-flex">
          {noHeader ? null : <HeaderSidebar />}
          <div className="d-flex flex-column flex-grow-1 real-body">
            {children}
            <Footer />
          </div>
        </div>
        {noHeader ? null : <BottomNavbar />}
        <Notifications />
      </AppProviders>
    </ErrorHandler>
  );
}

