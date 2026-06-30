import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PlausibleScript } from "@/components/PlausibleScript";
import { AuthProvider } from "@/lib/auth/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IndianHomes.nl",
  description:
    "Find Your Home in the Netherlands — Built for the Indian Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <PlausibleScript />
        </AuthProvider>
      </body>
    </html>
  );
}
