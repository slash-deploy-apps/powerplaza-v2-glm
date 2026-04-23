'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '~/i18n/navigation';
import { LanguageSwitcher } from '~/components/language-switcher';
import { ThemeToggle } from '~/components/theme-toggle';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '~/components/ui/sheet';
import { MenuIcon, ZapIcon, HomeIcon, PackageIcon, FileTextIcon, InfoIcon, SettingsIcon, XIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/' as const,         label: t('home'),     icon: HomeIcon },
    { href: '/products' as const, label: t('products'), icon: PackageIcon },
    { href: '/quote' as const,    label: t('quote'),    icon: FileTextIcon },
    { href: '/about' as const,    label: t('about'),    icon: InfoIcon },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full transition-colors duration-200',
          transparent
            ? 'border-b border-transparent bg-transparent text-white'
            : 'border-b bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}
      >
        <div className="container mx-auto flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <ZapIcon className={cn('size-5', transparent ? 'text-white' : 'text-primary')} />
            <span className="font-mono text-lg tracking-tight">POWERPLAZA</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  transparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <a href="/admin">
              <Button
                variant="outline"
                size="sm"
                className={cn(transparent && 'border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white')}
              >
                {tc('admin')}
              </Button>
            </a>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="ml-2 md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col p-0" showCloseButton={false}>
              {/* Header */}
              <div className="flex h-14 items-center justify-between border-b px-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold"
                  onClick={() => setOpen(false)}
                >
                  <ZapIcon className="size-4 text-primary" />
                  <span className="font-mono text-base tracking-tight">POWERPLAZA</span>
                </Link>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <XIcon className="size-4" />
                    <span className="sr-only">닫기</span>
                  </Button>
                </SheetClose>
              </div>

              {/* Nav links */}
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      {label}
                      {active && <ChevronRightIcon className="ml-auto size-4 opacity-60" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="border-t p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">테마 / 언어</span>
                  <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
                <a
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <SettingsIcon className="size-4 shrink-0" />
                  {tc('admin')}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {/* Spacer reserves flow space for the fixed header on non-home routes.
          Home keeps h-0 so the hero extends behind the transparent header. */}
      <div aria-hidden className={cn(isHome ? 'h-0' : 'h-14')} />
    </>
  );
}