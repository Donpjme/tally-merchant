import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import type { Metadata } from "next"; // Re-applied to use it properly
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Explicitly typed to solve the "Metadata is unused" error
export const metadata: Metadata = {
  title: "Tally",
  description: "The Commerce OS for Africa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Detect the current host
  const headerList = await headers();
  const host = headerList.get("host") || "";
  
  // 2. Define your main domains
  const isMainDomain = host === "localhost:3000" || host === "tally.ng" || host === "www.tally.ng";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 3. FIXED DOUBLED HEADER: 
           Only render the Global Tally Header if on the main site.
           This removes the "fixed" header that was overlapping your store.
        */}
        {isMainDomain && (
          <header className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center px-4 font-bold">
              Tally Main Nav
            </div>
          </header>
        )}

        {children}
      </body>
    </html>
  );
}