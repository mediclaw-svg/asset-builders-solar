import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Builders AI Solar | Power Your Future",
  description: "Premium solar installation, battery storage, financing guidance, and system monitoring. Get your free consultation today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
