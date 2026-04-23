import React from 'react';
import { FileText, Smartphone, Landmark, Home, FileBadge, ArrowRight } from 'lucide-react';

const icons = [FileText, Smartphone, Landmark, Home, FileBadge];

export function ProblemLoop({ content }: { content: any }) {
  return (
    <section className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-red-600">{content.badge}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.title}
          </p>
          <p className="mt-4 text-lg text-slate-600">
            {content.subtitle}
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {content.steps.map((step: any, index: number) => {
              const Icon = icons[index];
              return (
                <div key={index} className="relative flex flex-col items-center">
                  <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center hover:border-red-200 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  {index < content.steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 text-slate-300">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}