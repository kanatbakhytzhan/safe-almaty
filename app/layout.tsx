import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import SOSButton from "@/components/emergency/SOSButton";

export const metadata: Metadata = {
  title: "Safe Almaty - Your Safety Guide",
  description: "Comprehensive safety guide and emergency response system for tourists and residents in Almaty, Kazakhstan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
          <SOSButton />
        </SessionProvider>
      </body>
    </html>
  );
}

