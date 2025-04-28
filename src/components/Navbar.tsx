"use client";

import React, { useState, useEffect } from "react";
import { HoveredLink, MenuItem, Menu } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Menu as MenuIcon, X, ChevronDown, ChevronRight } from "lucide-react";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
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

  const toggleSubmenu = (menu: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <div
      className={cn(
        "fixed top-0 inset-x-0 max-w-full mx-auto z-50 bg-white shadow-sm border-b border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between p-3 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-gray-800 flex items-center">
          <Image src="/MineZero.jpeg" alt="Logo" width={48} height={48} className="mr-3 rounded-md" />
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">MineZero</span>
        </Link>
        
        {isMobile ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </Button>
        ) : (
          <div className="flex-grow flex justify-end">
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="Home">
                <HoveredLink href="/">Dashboard</HoveredLink>
              </MenuItem>
              
              <MenuItem setActive={setActive} active={active} item="Emissions">
                <HoveredLink href="/emissions">Calculate Emissions</HoveredLink>
              </MenuItem>
              
              <MenuItem setActive={setActive} active={active} item="Carbon Credits">
                <HoveredLink href="/carbon-credits">Buy Credits</HoveredLink>
                
              </MenuItem>
              
              <MenuItem setActive={setActive} active={active} item="Compliances">
                <HoveredLink href="/compliances">Compliances</HoveredLink>
              </MenuItem>

              <MenuItem setActive={setActive} active={active} item="Resources">
                <HoveredLink href="/resources">Resources Home</HoveredLink>

                <HoveredLink href="/carbon-neutrality/pathways">Carbon Neutrality</HoveredLink>

              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
      
      {isMobile && (
        <div 
          className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen border-t border-gray-200" : "max-h-0"}`}
          aria-hidden={!isMenuOpen}
        >
          <div className="p-4 divide-y divide-gray-100">
            <Link href="/" className="block py-3 px-2 hover:bg-gray-50 rounded-md text-gray-800" onClick={handleMobileNavClick}>Dashboard</Link>
            
            <Link href="/emissions" className="block py-3 px-2 hover:bg-gray-50 rounded-md text-gray-800" onClick={handleMobileNavClick}>Calculate Emissions</Link>
            
            <div className="py-1">
              <button 
                className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-50 rounded-md text-gray-800"
                onClick={() => toggleSubmenu('carbon-credits')}
              >
                <span>Carbon Credits</span>
                {expandedMenus['carbon-credits'] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedMenus['carbon-credits'] && (
                <div className="pl-4 space-y-1 mt-1">
                  <Link href="/carbon-credits" className="block py-2 px-2 hover:bg-gray-50 rounded-md text-gray-600" onClick={handleMobileNavClick}>Buy Credits</Link>

                </div>
              )}
            </div>
            
            <Link href="/compliances" className="block py-3 px-2 hover:bg-gray-50 rounded-md text-gray-800" onClick={handleMobileNavClick}>Compliances</Link>
            
            <div className="py-1">
              <button 
                className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-50 rounded-md text-gray-800"
                onClick={() => toggleSubmenu('resources')}
              >
                <span>Resources</span>
                {expandedMenus.resources ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              
              {expandedMenus.resources && (
                <div className="pl-4 space-y-1 mt-1">
                  <Link href="/resources" className="block py-2 px-2 hover:bg-gray-50 rounded-md text-gray-600" onClick={handleMobileNavClick}>Resources Home</Link>
                  <Link href="/resources/carbon-neutrality" className="block py-2 px-2 hover:bg-gray-50 rounded-md text-gray-600" onClick={handleMobileNavClick}>Carbon Neutrality</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Navbar };