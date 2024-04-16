import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Nav from "@/components/nav";
import { AuthContextProvider } from "@/providers/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  applicationName: "PinPin",
  title: "Youtube,Netflix,Spotify,Duolingo拼车合租共享 | 发车找车",
  description:
    "探索PinPin，发布拼车/合租/共享YouTube、Netflix、Duolingo等流行服务的订阅，免登录寻找车队，帮你省钱。",
};

export const viewport: Viewport = {
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
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
