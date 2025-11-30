'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Maximize,
  Music,
  Mic,
  Scissors,
  Eraser,
  PenTool,
} from "lucide-react";
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled ? 'py-4' : 'py-6'
      )}
    >
      <div className={cn(
        "mx-auto max-w-7xl px-6 transition-all duration-500",
        isScrolled ? "bg-white/70 backdrop-blur-xl border border-black/5 rounded-full py-3 shadow-lg" : ""
      )}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-40 overflow-hidden transition-all duration-300 group-hover:opacity-80">
              <img src="/logo.png" alt="Free AI Logo" className="h-full w-full object-contain object-left invert" />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-black/70 hover:text-black focus:bg-transparent data-[state=open]:text-black transition-colors">
                    Creation Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white/90 backdrop-blur-2xl border border-black/5 rounded-2xl shadow-2xl">
                      <div className="col-span-2 p-2">
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/40 px-2">
                          Visual Studio
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          <ListItem href="/studio/image" title="AI Image Lab" icon={ImageIcon}>
                            Create stunning artwork
                          </ListItem>
                          <ListItem href="/studio/video" title="AI Video Studio" icon={Video}>
                            Cinematic clips
                          </ListItem>
                          <ListItem href="/studio/upscale" title="Image Upscale" icon={Maximize}>
                            Enhance resolution
                          </ListItem>
                          <ListItem href="/studio/vector" title="AI Vectorizer" icon={PenTool}>
                            Convert to SVG
                          </ListItem>
                        </div>
                      </div>

                      <div className="col-span-2 p-2 border-t border-black/5">
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/40 px-2">
                          Audio & Music
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          <ListItem href="/studio/audio" title="AI Audio FX" icon={Music}>
                            Sound effects
                          </ListItem>
                          <ListItem href="/studio/song" title="Song Creator" icon={Music}>
                            Full songs
                          </ListItem>
                          <ListItem href="/studio/tts" title="Text to Speech" icon={Mic}>
                            Lifelike voices
                          </ListItem>
                        </div>
                      </div>

                      <div className="col-span-2 p-2 border-t border-black/5">
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/40 px-2">
                          Tools
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                          <ListItem href="/studio/remove-bg" title="Magic Eraser" icon={Scissors}>
                            Transparent PNGs
                          </ListItem>
                          <ListItem href="/studio/eraser" title="Magic Eraser" icon={Eraser}>
                            Remove objects
                          </ListItem>
                        </div>
                      </div>
                      <Link href="/studio/subtitles" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-black/5 focus:bg-black/5">
                        <div className="text-sm font-medium leading-none text-[#1d1d1f]">Auto Subtitles</div>
                        <p className="line-clamp-2 text-sm leading-snug text-black/50">
                          Generate SRT subtitles from video/audio
                        </p>
                      </Link>
                      <Link href="/studio/voice-changer" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-black/5 focus:bg-black/5">
                        <div className="text-sm font-medium leading-none text-[#1d1d1f]">Voice Changer</div>
                        <p className="line-clamp-2 text-sm leading-snug text-black/50">
                          Transform voices with AI models
                        </p>
                      </Link>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/guide" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:text-black focus:text-black focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Guide
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="default" size="sm" className="h-9 px-5 text-xs rounded-full bg-[#007AFF] hover:bg-[#0066CC] text-white">
              Start Creating
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & { title: string; icon: any }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-black/5 group',
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/5 text-black/60 ring-1 ring-black/5 transition-colors group-hover:bg-[#007AFF]/10 group-hover:text-[#007AFF] group-hover:ring-[#007AFF]/20">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium leading-none text-[#1d1d1f] group-hover:text-black transition-colors">
                {title}
              </div>
              <p className="mt-1 line-clamp-1 text-[11px] leading-snug text-black/40 group-hover:text-black/60 transition-colors">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
