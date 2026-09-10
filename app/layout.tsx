import type { Metadata } from 'next';
import { Mali, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const mali = Mali({
  variable: '--font-mali',
  subsets: ['thai', 'latin'],
  weight: ['500', '600', '700'],
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
        className={`${notoSansThai.variable} ${mali.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
