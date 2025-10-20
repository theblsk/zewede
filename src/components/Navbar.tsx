'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Link } from "@heroui/react";
import { logout } from "@/app/[locale]/(public)/login/actions";

type PublicNavbarProps = {
  showDashboardLink?: boolean;
  isLoggedIn?: boolean;
};

export default function PublicNavbar({ showDashboardLink = false, isLoggedIn = false }: PublicNavbarProps) {
  const t = useTranslations('navbar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const locale = useLocale(); // 'en' | 'ar'
  const pathname = usePathname();
  const router = useRouter();

  function handleLanguageSwitch() {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    // Replace current route with the same path under the other locale
    router.replace(pathname, { locale: nextLocale });
  }

  const menuItems = [
    { key: 'home', label: t('home'), href: '#home' },
    { key: 'menu', label: t('menu'), href: '#menu' },
    { key: 'about', label: t('about'), href: '#about' },
    { key: 'contact', label: t('contact'), href: '#contact' },
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-hlb-primary text-white"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarBrand>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold">{t('title')}</h1>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.key}>
            <Link
              href={item.href}
              className="text-white hover:text-hlb-gold transition-colors"
            >
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Show Dashboard link only for managers/admins */}
        {showDashboardLink && (
          <NavbarItem className="hidden sm:block">
            <Link
              href={`/${locale}/dashboard`}
              className="text-white hover:text-hlb-gold transition-colors"
            >
              {t('dashboard')}
            </Link>
          </NavbarItem>
        )}
        
        {/* Show Logout for all logged-in users */}
        {isLoggedIn ? (
          <NavbarItem className="hidden sm:block">
            <Button
              onPress={() => logout()}
              color="danger"
              variant="solid"
              size="sm"
              className="font-semibold"
            >
              {t('logout')}
            </Button>
          </NavbarItem>
        ) : (
          // Show login button for all unauthenticated users
          <NavbarItem className="hidden sm:block">
            <Button
              as={Link}
              href={`/${locale}/login`}
              color="warning"
              variant="solid"
              size="sm"
              className="font-semibold"
            >
              {t('login')}
            </Button>
          </NavbarItem>
        )}
        
        <NavbarItem>
          <Button
            variant="light"
            size="sm"
            onPress={handleLanguageSwitch}
            className="text-white hover:text-hlb-gold min-w-0 px-2"
          >
            <Globe color="white" size={20} />
          </Button>
        </NavbarItem>
        
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-white sm:hidden"
        />
      </NavbarContent>

      <NavbarMenu className="bg-hlb-primary">
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.key}>
            <Link
              href={item.href}
              className="w-full text-white hover:text-hlb-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        
        {/* Show Dashboard link in mobile menu only for managers/admins */}
        {showDashboardLink && (
          <NavbarMenuItem key="dashboard">
            <Link
              href={`/${locale}/dashboard`}
              className="w-full text-white hover:text-hlb-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('dashboard')}
            </Link>
          </NavbarMenuItem>
        )}
        
        {/* Show Logout for all logged-in users in mobile menu */}
        {isLoggedIn ? (
          <NavbarMenuItem key="logout">
            <Button
              onPress={() => {
                setIsMenuOpen(false);
                logout();
              }}
              color="danger"
              variant="solid"
              size="sm"
              className="w-full font-semibold"
            >
              {t('logout')}
            </Button>
          </NavbarMenuItem>
        ) : (
          // Show login button for all unauthenticated users in mobile menu
          <NavbarMenuItem key="login">
            <Button
              as={Link}
              href={`/${locale}/login`}
              color="warning"
              variant="solid"
              size="sm"
              className="w-full font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('login')}
            </Button>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
