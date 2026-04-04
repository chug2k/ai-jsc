import type { Metadata } from 'next';
import { Montserrat, Roboto, PT_Mono } from 'next/font/google';
import PostHogProvider from '@/components/PostHogProvider';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const ptMono = PT_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pt-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'jobsearch.quest — Never Search Alone',
  description:
    'Stop searching alone. An AI-powered accountability council that meets you every week, challenges your thinking, and pushes you toward the right role.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable} ${ptMono.variable}`}>
      <body className="bg-[#FAFAF8] text-[#111827] font-[family-name:var(--font-roboto)] antialiased">
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
