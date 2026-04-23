// Idiomas suportados pelo sistema
export type PreferredLanguage = 'en' | 'es' | 'fr' | 'pt';

// 1. O que vem do Frontend (AuthForm.tsx)
// Os selects do HTML retornam strings ('true'/'false'), então tratamos isso aqui.
export interface SignUpFormData {
  email: string;
  password?: string; // Opcional caso no futuro você ative Google OAuth
  country: string;
  arrivalDate: string;
  departureDate: string;
  hasHousing: string; 
  hasCpf: string;
}

// 2. O Payload para o Supabase Auth (raw_user_meta_data)
// Este é o objeto exato que enviaremos na Server Action para o Supabase.
// O banco de dados vai ler isso para disparar o Trigger e preencher o perfil.
export interface UserMetaData {
  country: string;
  arrival_date: string;
  departure_date: string;
  has_housing: boolean;
  has_cpf: boolean;
  preferred_language: PreferredLanguage;
}

// 3. A Tabela Final no Banco (profiles)
// Como o dado será retornado quando a IA ou o Dashboard consultarem o usuário.
export interface UserProfile {
  id: string;
  full_name?: string | null;
  country: string;
  arrival_date: string;
  departure_date: string;
  initial_housing_status: boolean;
  initial_cpf_status: boolean;
  preferred_language: PreferredLanguage;
  created_at: string;
  updated_at: string;
}