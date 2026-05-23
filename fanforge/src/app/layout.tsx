import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { ToastProvider } from "@/components/shared/Toast";

export const metadata: Metadata = {
  title: "FanForge — AI World Cup Content Engine",
  description:
    "Speak your team. Get a complete FIFA World Cup 2026 fan content kit in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        <ToastProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto min-h-screen">{children}</main>
            <ChatPanel />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
