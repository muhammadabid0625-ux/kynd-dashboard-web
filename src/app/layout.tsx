import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kynd Saving Dashboard",
  description: "Admin and affiliate backend dashboard for Kynd Saving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
