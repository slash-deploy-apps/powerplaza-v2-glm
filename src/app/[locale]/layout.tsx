import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { TRPCReactProvider } from '~/trpc/react';
import { routing } from '~/i18n/routing';
import { SiteHeader } from '~/components/site-header';

export const metadata: Metadata = {
  title: 'PowerPlaza - 전력 변환 솔루션',
  description: 'DC-DC, AC-DC 컨버터 및 EV 부품 전문 | Power Conversion Solutions',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <TRPCReactProvider>
        <SiteHeader />
        {children}
      </TRPCReactProvider>
    </NextIntlClientProvider>
  );
}