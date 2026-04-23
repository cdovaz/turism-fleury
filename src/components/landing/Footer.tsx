import React from 'react';
import { Globe2 } from 'lucide-react';

export function Footer({ content }: { content: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          
          {/* Brand & Description */}
          <div className="flex justify-center md:justify-start">
            <div className="flex items-center gap-2 text-white">
              <Globe2 className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-bold tracking-tight">Survival Protocol</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="mt-8 flex justify-center gap-x-8 md:mt-0">
            <a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">
              {content.about}
            </a>
            <a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">
              {content.guide}
            </a>
            <a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">
              {content.privacy}
            </a>
            <a href="#" className="text-sm leading-6 text-slate-400 hover:text-white transition-colors">
              {content.contact}
            </a>
          </div>
        </div>
        
        {/* Copyright & Disclaimer */}
        <div className="mt-8 border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs leading-5 text-slate-500 text-center md:text-left">
            &copy; {currentYear} {content.rights}
          </p>
          <p className="text-xs leading-5 text-slate-600 text-center md:text-right">
            {content.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}