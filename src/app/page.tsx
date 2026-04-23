"use client";

import React, { useState, useEffect } from 'react';
import { Hero } from "@/components/landing/Hero";
import { ProblemLoop } from "@/components/landing/ProblemLoop";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { Footer } from "@/components/landing/Footer";
import { Language, dict } from "@/lib/dictionaries";

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('en');

  // Ao montar o componente, verifica se já existe um idioma salvo
  useEffect(() => {
    const savedLang = localStorage.getItem('survival_lang') as Language;
    if (savedLang && ['en', 'es', 'fr', 'pt'].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  // Função para trocar o idioma e salvar no storage
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('survival_lang', newLang);
  };

  const content = dict[lang];

  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-end p-6 max-w-7xl mx-auto">
        <div className="flex gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-slate-200 shadow-sm">
          {(['en', 'es', 'fr', 'pt'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)} // Usa a nova função aqui
              className={`text-xs font-bold uppercase px-2 py-1 rounded-full transition-colors ${
                lang === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <Hero content={content.hero} />
      <ProblemLoop content={content.problem} />
      <FeatureShowcase content={content.features} />
      <Footer content={content.footer} />
    </main>
  );
}