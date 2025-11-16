/*
  # Create Indictments System Schema

  1. New Tables
    - `indictments`
      - `id` (uuid, primary key) - Unique identifier
      - `accused_names` (text) - Full names of accused persons
      - `personal_data` (text) - Personal data of each accused
      - `charges_description` (text) - Essence of charges
      - `crime_location` (text) - Location of crime
      - `crime_time` (text) - Time of crime
      - `crime_methods` (text) - Methods used
      - `crime_motives` (text) - Motives
      - `crime_goals` (text) - Goals
      - `crime_consequences` (text) - Consequences
      - `other_circumstances` (text) - Other relevant circumstances
      - `criminal_code_article` (text) - Criminal code article reference
      - `prosecution_evidence` (text) - Evidence supporting prosecution
      - `defense_evidence` (text) - Evidence from defense
      - `mitigating_circumstances` (text) - Mitigating circumstances
      - `aggravating_circumstances` (text) - Aggravating circumstances
      - `victim_data` (text) - Victim information
      - `damage_description` (text) - Description of damage
      - `civil_plaintiff` (text) - Civil plaintiff data
      - `civil_defendant` (text) - Civil defendant data
      - `case_references` (text) - References to case volumes and pages
      - `investigator_name` (text) - Name of investigator
      - `completion_location` (text) - Location where document was completed
      - `completion_date` (date) - Date of completion
      - `witnesses_prosecution` (text) - List of prosecution witnesses
      - `witnesses_defense` (text) - List of defense witnesses
      - `investigation_terms` (text) - Terms of investigation
      - `preventive_measures` (text) - Preventive measures taken
      - `material_evidence` (text) - Material evidence
      - `civil_claim` (text) - Civil claim information
      - `penalty_measures` (text) - Measures to ensure penalty execution
      - `procedural_costs` (text) - Procedural costs
      - `dependents_measures` (text) - Measures for dependents
      - `fine_payment_info` (text) - Fine payment information
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `indictments` table
    - Add policy for public access (no authentication required as per requirements)
*/

CREATE TABLE IF NOT EXISTS indictments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accused_names text DEFAULT '',
  personal_data text DEFAULT '',
  charges_description text DEFAULT '',
  crime_location text DEFAULT '',
  crime_time text DEFAULT '',
  crime_methods text DEFAULT '',
  crime_motives text DEFAULT '',
  crime_goals text DEFAULT '',
  crime_consequences text DEFAULT '',
  other_circumstances text DEFAULT '',
  criminal_code_article text DEFAULT '',
  prosecution_evidence text DEFAULT '',
  defense_evidence text DEFAULT '',
  mitigating_circumstances text DEFAULT '',
  aggravating_circumstances text DEFAULT '',
  victim_data text DEFAULT '',
  damage_description text DEFAULT '',
  civil_plaintiff text DEFAULT '',
  civil_defendant text DEFAULT '',
  case_references text DEFAULT '',
  investigator_name text DEFAULT '',
  completion_location text DEFAULT '',
  completion_date date DEFAULT now(),
  witnesses_prosecution text DEFAULT '',
  witnesses_defense text DEFAULT '',
  investigation_terms text DEFAULT '',
  preventive_measures text DEFAULT '',
  material_evidence text DEFAULT '',
  civil_claim text DEFAULT '',
  penalty_measures text DEFAULT '',
  procedural_costs text DEFAULT '',
  dependents_measures text DEFAULT '',
  fine_payment_info text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE indictments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view indictments"
  ON indictments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert indictments"
  ON indictments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update indictments"
  ON indictments
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete indictments"
  ON indictments
  FOR DELETE
  TO anon
  USING (true);