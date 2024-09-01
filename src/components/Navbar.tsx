"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, MenuItem, Menu } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Menu as MenuIcon, X } from "lucide-react";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 max-w-full mx-auto z-50 bg-gray-50 border-b border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between p-2 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
          <Image src="/MineZero.jpeg" alt="Logo" width={60} height={60} className="mr-3" />
          <span className="flex items-center text-3xl">MineZero</span>
        </Link>
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <MenuIcon />}
          </Button>
        ) : (
          <div className="flex-grow flex justify-end mr-8">
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="Home">
                <HoveredLink href="/">Dashboard</HoveredLink>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Emissions">
                <HoveredLink href="/emissions">Calculate Emissions</HoveredLink>
                <HoveredLink href="/emissions-history">Emissions History</HoveredLink>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Compliances">
                <HoveredLink href="/compliances">Compliances</HoveredLink>
              </MenuItem>
              <MenuItem setActive={setActive} active={active} item="Resources">
                <HoveredLink href="/resources/best-practices">Best Practices</HoveredLink>
                <HoveredLink href="/resources/regulations">Regulations</HoveredLink>
                <HoveredLink href="/resources/offset-programs">Offset Programs</HoveredLink>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
      {isMobile && isMenuOpen && (
        <div className="bg-gray-50 p-4">
          <Link href="/" className="block py-2" onClick={handleMobileNavClick}>Dashboard</Link>
          <Link href="/emissions" className="block py-2" onClick={handleMobileNavClick}>Calculate Emissions</Link>
          <Link href="/emissions-history" className="block py-2" onClick={handleMobileNavClick}>Emissions History</Link>
          <Link href="/reports/daily" className="block py-2" onClick={handleMobileNavClick}>Daily Reports</Link>
          <Link href="/reports/monthly" className="block py-2" onClick={handleMobileNavClick}>Monthly Reports</Link>
          <Link href="/reports/annual" className="block py-2" onClick={handleMobileNavClick}>Annual Reports</Link>
          <Link href="/resources/best-practices" className="block py-2" onClick={handleMobileNavClick}>Best Practices</Link>
          <Link href="/resources/regulations" className="block py-2" onClick={handleMobileNavClick}>Regulations</Link>
          <Link href="/resources/offset-programs" className="block py-2" onClick={handleMobileNavClick}>Offset Programs</Link>
        </div>
      )}
    </div>
  );
}

export { Navbar };
