import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import AuthWatcher from "@/components/AuthWatcher";
import FloatingCart from "@/components/FloatingCart";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Ngantin - Polines",
  description: "Kantin Digital Polines",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased text-gray-700 dark:text-gray-200 dark:bg-gray-900`}>
          <Toaster />
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              <AppContextProvider>
                <AuthWatcher />
                {children}
                <FloatingCart />
              </AppContextProvider>
            </ThemeProvider>
          </NextThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
