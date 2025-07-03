import type {Metadata} from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Zaina - AI Assistant',
  description: 'An AI-powered assistant with custom training capabilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="animated-bg">
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
            <div className="heart"></div>
        </div>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
