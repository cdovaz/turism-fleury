import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe2 } from 'lucide-react';

export function Hero({ content }: { content: any }) {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        
        <div className="mb-8 flex justify-center">
          <span className="relative rounded-full bg-blue-50 px-3 py-1 text-sm leading-6 text-blue-600 ring-1 ring-inset ring-blue-500/10 flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            {content.badge}
          </span>
        </div>

        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
          {content.title} <span className="text-blue-600">{content.highlight}</span>{content.titleEnd}
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          {content.subtitle}
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          {/* Tag atualizada de button para Link com a propriedade href */}
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all"
          >
            {content.cta}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-14 flex justify-center gap-8 text-sm font-medium text-slate-500 sm:gap-12">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            {content.trust1}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            {content.trust2}
          </div>
        </div>
        
      </div>
    </section>
  );
}