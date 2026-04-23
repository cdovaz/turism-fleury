"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe2 } from 'lucide-react';
import { AuthForm } from '@/components/login/AuthForm';
import { Language, dict } from '@/lib/dictionaries';

export default function LoginPage() {
  const [lang, setLang] = useState<Language>('en');
  
  // Resgata o idioma salvo quando a página de login carregar
  useEffect(() => {
    const savedLang = localStorage.getItem('survival_lang') as Language;
    if (savedLang && ['en', 'es', 'fr', 'pt'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('survival_lang', newLang);
  };

  const content = dict[lang];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative selection:bg-blue-100 selection:text-blue-900">
      
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <div className="flex gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200 shadow-sm">
          {(['en', 'es', 'fr', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full transition-colors ${
                lang === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {/* Agora usando o dicionário traduzido */}
          {content.auth.backToHome}
        </Link>
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
          <Globe2 className="h-6 w-6 text-blue-600" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Survival Protocol
        </span>
      </div>

      <AuthForm content={content.auth} />

      <p className="mt-8 text-xs text-slate-400 text-center max-w-sm">
        Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
      </p>

    </main>
  );
}