import type { Metadata } from "next";
import { Geist, Geist_Mono, Recursive } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthProvider";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Feedback App",
  description: "A platform where you can give feedback anonymously.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${recursive.className} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navbar />
            <Toaster richColors position="top-center"/>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
