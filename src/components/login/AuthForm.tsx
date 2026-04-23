"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Globe, Calendar, Home, Loader2, Plane, FileText, AlertCircle } from 'lucide-react';
import { signInAction, signUpAction } from '@/actions/auth.actions';
import { PreferredLanguage } from '@/types/auth.types';

export function AuthForm({ content }: { content: any }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    country: '',
    arrivalDate: '',
    departureDate: '',
    hasHousing: 'false',
    hasCpf: 'false'
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (!isLogin) {
        // FLUXO: CRIAÇÃO DE CONTA
        // Capturamos o idioma atual da interface para salvar como preferência da IA
        const currentLang = (localStorage.getItem('survival_lang') as PreferredLanguage) || 'en';
        
        const response = await signUpAction(formData, currentLang);
        
        if (response.success) {
          setIsLogin(true); 
          setSuccessMessage(content.signUpSuccess);
        } else {
          setErrorMessage(response.error || "Ocorreu um erro ao criar a conta.");
        }
      } else {
        // FLUXO: LOGIN
        const response = await signInAction({
          email: formData.email,
          password: formData.password
        });
        
        if (response.success) {
          // O cookie de sessão já foi "setado" no servidor pela Server Action
          router.push('/dashboard');
        } else {
          setErrorMessage(response.error || "Credenciais inválidas.");
        }
      }
    } catch (error) {
      setErrorMessage("Erro inesperado de conexão.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      
      {/* MENSAGEM DE SUCESSO */}
      {successMessage && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-xl text-center animate-in fade-in slide-in-from-top-2">
          {successMessage}
        </div>
      )}

      {/* MENSAGEM DE ERRO (Nova Adição) */}
      {errorMessage && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isLogin ? content.loginTitle : content.signUpTitle}
        </h1>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        {/* Campo: Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 ml-1">{content.emailLabel}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        {/* Campo: Senha */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 ml-1">{content.passwordLabel}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>

        {/* CAMPOS EXTRAS APENAS PARA CADASTRO */}
        {!isLogin && (
          <div className="space-y-4 mt-2 pt-4 border-t border-slate-100 animate-in fade-in zoom-in-95 duration-300">
            {/* País */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">{content.countryLabel}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required={!isLogin}
                  placeholder="e.g. France, Mexico..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            {/* Grid de Datas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 ml-1 line-clamp-1" title={content.arrivalLabel}>
                  {content.arrivalLabel}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    required={!isLogin}
                    className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm"
                    onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 ml-1 line-clamp-1" title={content.departureLabel}>
                  {content.departureLabel}
                </label>
                <div className="relative">
                  <Plane className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    required={!isLogin}
                    className="w-full pl-10 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-600 text-sm"
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Status do CPF */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">{content.cpfLabel}</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-600 cursor-pointer"
                  onChange={(e) => setFormData({...formData, hasCpf: e.target.value})}
                >
                  <option value="false">{content.cpfOption2}</option>
                  <option value="true">{content.cpfOption1}</option>
                </select>
              </div>
            </div>

            {/* Status de Moradia */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 ml-1">{content.housingLabel}</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-600 cursor-pointer"
                  onChange={(e) => setFormData({...formData, hasHousing: e.target.value})}
                >
                  <option value="false">{content.housingOption2}</option>
                  <option value="true">{content.housingOption1}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botão Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-slate-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all mt-4 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? content.submitLogin : content.submitSignUp)}
        </button>

        {/* Botão de Toggle */}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setSuccessMessage('');
            setErrorMessage('');
          }}
          className="text-sm text-blue-600 font-medium hover:underline mt-2 text-center"
        >
          {isLogin ? content.toggleToSignUp : content.toggleToLogin}
        </button>
      </form>
    </div>
  );
}