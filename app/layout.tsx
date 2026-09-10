import type { Metadata } from 'next';
import { Google_Sans } from 'next/font/google';
import './globals.css';

const googleSans = Google_Sans({
  variable: '--font-google-sans',
  subsets: ['thai', 'latin'],
  weight: 'variable',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PowerBox — กล่องพลังใจ',
  description: 'Share kindness and positive energy with your community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${googleSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
