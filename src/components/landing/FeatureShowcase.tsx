import React from 'react';
import { ListChecks, Bot, Zap, Clock } from 'lucide-react';

export function FeatureShowcase({ content }: { content: any }) {
  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl text-center mb-20">
          <h2 className="text-base font-semibold leading-7 text-blue-600">{content.badge}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.title}
          </p>
          <p className="mt-4 text-lg text-slate-600">
            {content.subtitle}
          </p>
        </div>

        {/* Feature 1: The Checklist (Trail) */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center mb-24">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                <ListChecks className="h-5 w-5" />
                <span>{content.feat1}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {content.feat1Title}
              </h3>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {content.feat1Desc}
              </p>
              <ul className="mt-8 space-y-4 text-slate-600">
                <li className="flex gap-x-3 items-center">
                  <Zap className="h-5 w-5 text-blue-600 flex-none" />
                  {content.feat1Bul1}
                </li>
                <li className="flex gap-x-3 items-center">
                  <Clock className="h-5 w-5 text-blue-600 flex-none" />
                  {content.feat1Bul2}
                </li>
              </ul>
            </div>
          </div>
          {/* Mockup Placeholder */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 shadow-sm h-80 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-4 left-4 right-4 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-4 gap-3 opacity-80">
                <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                <div className="h-3 w-32 bg-slate-200 rounded-full"></div>
             </div>
             <div className="absolute top-20 left-4 right-4 h-24 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-4 gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">!</div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-slate-800 rounded-full"></div>
                  <div className="h-3 w-full bg-slate-200 rounded-full"></div>
                </div>
             </div>
             <div className="absolute top-48 left-4 right-4 h-24 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-4 gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">🔒</div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-slate-400 rounded-full"></div>
                  <div className="h-3 w-56 bg-slate-200 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Feature 2: The AI Concierge */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          {/* Mockup Placeholder */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-xl h-80 flex flex-col justify-end relative overflow-hidden order-last lg:order-first">
            <div className="absolute top-8 left-8 right-16 bg-slate-800 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300">
              I need help with the RNM form.
            </div>
            <div className="absolute top-28 left-16 right-8 bg-blue-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white shadow-lg">
              No problem! Just send me a photo of your passport and I'll fill out the official draft.
            </div>
            <div className="w-full h-12 bg-slate-800 rounded-full mt-auto flex items-center px-4">
              <div className="h-4 w-32 bg-slate-600 rounded-full opacity-50"></div>
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="lg:max-w-lg">
              <div className="flex items-center gap-2 text-blue-600 font-semibold mb-4">
                <Bot className="h-5 w-5" />
                <span>{content.feat2}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {content.feat2Title}
              </h3>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {content.feat2Desc}
              </p>
              <ul className="mt-8 space-y-4 text-slate-600">
                <li className="flex gap-x-3 items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600 flex-none" />
                  {content.feat2Bul1}
                </li>
                <li className="flex gap-x-3 items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600 flex-none" />
                  {content.feat2Bul2}
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}