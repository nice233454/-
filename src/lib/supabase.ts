import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Indictment {
  id?: string;
  accused_names: string;
  personal_data: string;
  charges_description: string;
  crime_location: string;
  crime_time: string;
  crime_methods: string;
  crime_motives: string;
  crime_goals: string;
  crime_consequences: string;
  other_circumstances: string;
  criminal_code_article: string;
  prosecution_evidence: string;
  defense_evidence: string;
  mitigating_circumstances: string;
  aggravating_circumstances: string;
  victim_data: string;
  damage_description: string;
  civil_plaintiff: string;
  civil_defendant: string;
  case_references: string;
  investigator_name: string;
  completion_location: string;
  completion_date: string;
  witnesses_prosecution: string;
  witnesses_defense: string;
  investigation_terms: string;
  preventive_measures: string;
  material_evidence: string;
  civil_claim: string;
  penalty_measures: string;
  procedural_costs: string;
  dependents_measures: string;
  fine_payment_info: string;
  created_at?: string;
  updated_at?: string;
}
