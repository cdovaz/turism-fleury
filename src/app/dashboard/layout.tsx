"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Globe2, Map, LayoutList, LogOut, BotMessageSquare, Loader2 } from 'lucide-react';
import { Language, dict } from '@/lib/dictionaries';
import { signOutAction, updateUserLanguageAction } from '@/actions/auth.actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>('en');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('survival_lang') as Language;
    if (savedLang && ['en', 'es', 'fr', 'pt'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = async (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('survival_lang', newLang);
    
    // Agora o await funciona perfeitamente!
    await updateUserLanguageAction(newLang);
  };

  // A função que liga o clique com o banco de dados
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const response = await signOutAction();
    
    if (response.success) {
      // Como a Server Action já limpou o cookie do Supabase, 
      // jogar o usuário para a home fará o Middleware atuar perfeitamente.
      router.push('/'); 
    } else {
      console.error("Erro ao fazer logout:", response.error);
      setIsLoggingOut(false);
    }
  };

  const content = dict[lang].dashboard;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 hidden sm:block tracking-tight">
              Survival Protocol
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 pt-5' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutList className="h-4 w-4" />
              {content.navSurvival}
            </Link>
            <Link 
              href="/dashboard/explore" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/dashboard/explore' ? 'text-blue-600 border-b-2 border-blue-600 pb-5 pt-5' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Map className="h-4 w-4" />
              {content.navExplore}
            </Link>
          </nav>

          {/* Right Side: Language & Profile */}
          <div className="flex items-center gap-4">
            {/* Mini Language Switcher */}
            <select 
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="text-xs font-bold uppercase bg-slate-100 text-slate-600 py-1.5 px-2 rounded-md outline-none cursor-pointer hover:bg-slate-200 transition-colors border-none"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
            </select>

            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            {/* BOTAO DE LOGOUT CONECTADO */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="hidden sm:block">{content.navLogout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        {children}
      </main>

      {/* Floating AI Concierge Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="group flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <BotMessageSquare className="h-5 w-5" />
          <span className="text-sm font-semibold pr-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            {content.askAi}
          </span>
        </button>
      </div>

    </div>
  );
}