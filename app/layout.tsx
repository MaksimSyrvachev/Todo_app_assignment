import type { Metadata } from "next";

import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Simple todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
