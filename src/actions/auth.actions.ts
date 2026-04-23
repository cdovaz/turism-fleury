"use server";

import { createClient } from '@/lib/supabase/server';
import { SignUpFormData, UserMetaData, PreferredLanguage } from '@/types/auth.types';
import { revalidatePath } from 'next/cache';
const parseBoolean = (value: string) => value === 'true';

export async function signUpAction(formData: SignUpFormData, currentLang: PreferredLanguage) {
  const supabase = await createClient();

  const metaData: UserMetaData = {
    country: formData.country,
    arrival_date: formData.arrivalDate,
    departure_date: formData.departureDate,
    has_housing: parseBoolean(formData.hasHousing),
    has_cpf: parseBoolean(formData.hasCpf),
    preferred_language: currentLang,
  };

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password || '', 
    options: {
      data: metaData, // É isso que o `new.raw_user_meta_data` lê no banco de dados!
    },
  });

  if (error) {
    console.error("Erro no SignUp:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signInAction(formData: Pick<SignUpFormData, 'email' | 'password'>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password || '',
  });

  if (error) {
    console.error("Erro no SignIn:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erro no SignOut:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateUserLanguageAction(newLang: PreferredLanguage) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Não autenticado" };

  const { error } = await supabase
    .from('profiles')
    .update({ preferred_language: newLang })
    .eq('id', user.id);

  if (error) {
    console.error("Erro ao atualizar idioma:", error);
    return { success: false };
  }

  revalidatePath('/dashboard');
  
  return { success: true };
}