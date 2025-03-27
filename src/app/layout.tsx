import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "FORGE ESSENCE",
   description: "FORGE ESSENCE",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
      >
         <body className={inter.className}>
            <ToastProvider>
               <ThirdwebProvider>
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="dark"
                     enableSystem
                     disableTransitionOnChange
                  >
                     {children}
                     <Toaster />
                  </ThemeProvider>
               </ThirdwebProvider>
            </ToastProvider>
         </body>
         <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID! ?? "G-JWXHX6PBPE"} />
      </html>
   );
}
