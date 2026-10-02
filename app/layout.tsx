import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "LurkStack",
    template: "%s · LurkStack",
  },
  description: "LurkStack — one shared, ruled column for short text updates. Post, comment and react.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "LurkStack",
    description: "One shared, ruled column for short text updates.",
    siteName: "LurkStack",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F4D3D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
