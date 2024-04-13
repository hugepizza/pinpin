import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/nav";
import { AuthContextProvider } from "@/providers/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(GeistSans.className)}>
      <body className="bg-primary-foreground text-foreground w-screen min-h-screen overflow-x-hidden flex flex-col">
        <AuthContextProvider>
          <Nav />
          <div className="flex flex-col items-center w-full  px-1 sm:px-48 grow">
            {children}
          </div>
        </AuthContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
