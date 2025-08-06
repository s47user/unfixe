/*
  # Create courses and legal_resources tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `code` (text, unique, required)
      - `title` (text, required)
      - `description` (text)
      - `level` (integer, required)
      - `semester` (integer, required)
      - `credits` (integer, required)
      - `category` (text, required, check constraint)
      - `prerequisites` (jsonb, nullable)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `legal_resources`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `type` (text, required, check constraint)
      - `category` (text, required)
      - `jurisdiction` (text, required)
      - `year` (integer, required)
      - `citation` (text, nullable)
      - `summary` (text, required)
      - `url` (text, nullable)
      - `tags` (jsonb, nullable)
      - `relevant_courses` (jsonb, nullable)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage content
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  level integer NOT NULL,
  semester integer NOT NULL,
  credits integer NOT NULL,
  category text NOT NULL CHECK (category IN ('core', 'elective', 'practical')),
  prerequisites jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create legal_resources table
CREATE TABLE IF NOT EXISTS legal_resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('case', 'statute', 'regulation', 'journal', 'textbook', 'article')),
  category text NOT NULL,
  jurisdiction text NOT NULL,
  year integer NOT NULL,
  citation text,
  summary text NOT NULL,
  url text,
  tags jsonb DEFAULT '[]'::jsonb,
  relevant_courses jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for courses table
CREATE POLICY "Anyone can read courses"
  ON courses
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for legal_resources table
CREATE POLICY "Anyone can read legal resources"
  ON legal_resources
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert legal resources"
  ON legal_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update legal resources"
  ON legal_resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete legal resources"
  ON legal_resources
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS courses_level_idx ON courses(level);
CREATE INDEX IF NOT EXISTS courses_category_idx ON courses(category);
CREATE INDEX IF NOT EXISTS courses_code_idx ON courses(code);

CREATE INDEX IF NOT EXISTS legal_resources_type_idx ON legal_resources(type);
CREATE INDEX IF NOT EXISTS legal_resources_category_idx ON legal_resources(category);
CREATE INDEX IF NOT EXISTS legal_resources_year_idx ON legal_resources(year);
CREATE INDEX IF NOT EXISTS legal_resources_jurisdiction_idx ON legal_resources(jurisdiction);

-- Insert sample courses data
INSERT INTO courses (code, title, description, level, semester, credits, category, prerequisites) VALUES
('LAW 101', 'Administrative Law', 'Powers and duties of administrative bodies, judicial review of administrative action, and administrative procedures.', 100, 1, 3, 'core', '[]'),
('LAW 102', 'ADR (Alternative Dispute Resolution)', 'Mediation, arbitration, negotiation, and other non-litigation dispute resolution methods.', 100, 1, 3, 'core', '[]'),
('LAW 103', 'Banking Law', 'Financial regulations, banking operations, monetary policy, and banking sector governance.', 100, 2, 4, 'core', '[]'),
('LAW 104', 'Chieftaincy Law', 'Traditional authority systems, customary law, chieftaincy disputes, and traditional governance.', 100, 2, 4, 'core', '[]'),
('LAW 201', 'Civil Liability', 'Principles of civil responsibility, damages, compensation, and liability frameworks.', 200, 1, 4, 'core', '[]'),
('LAW 202', 'Civil Procedure', 'Court procedures, pleadings, discovery, trial practice, and civil litigation processes.', 200, 1, 3, 'core', '[]'),
('LAW 203', 'Commercial Law', 'Business transactions, commercial contracts, trade law, and commercial dispute resolution.', 200, 2, 4, 'core', '[]'),
('LAW 204', 'Company Law', 'Corporate formation, governance, shareholders rights, mergers, and corporate responsibilities.', 200, 2, 4, 'core', '[]'),
('LAW 205', 'Conflict of Laws', 'Private international law, jurisdiction, choice of law, and cross-border legal issues.', 200, 2, 3, 'core', '[]'),
('LAW 301', 'Constitutional Law', 'Constitutional principles, fundamental rights, separation of powers, and constitutional interpretation.', 300, 1, 4, 'core', '[]'),
('LAW 302', 'Contract Law', 'Formation, performance, breach of contracts, remedies, and contractual obligations.', 300, 1, 4, 'core', '[]'),
('LAW 303', 'Conveyancing and Drafting', 'Property transfers, legal drafting, conveyancing procedures, and document preparation.', 300, 1, 3, 'core', '[]'),
('LAW 304', 'Criminal Law', 'Criminal offenses, defenses, criminal responsibility, and criminal justice system.', 300, 2, 3, 'core', '[]'),
('LAW 305', 'Criminal Procedure', 'Criminal trial procedures, evidence in criminal cases, and criminal justice processes.', 300, 2, 3, 'core', '[]'),
('LAW 306', 'Environmental Law', 'Environmental regulations, pollution control, climate law, and natural resource protection.', 300, 2, 3, 'core', '[]'),
('LAW 401', 'Equity and Succession', 'Equitable principles, trusts, wills, inheritance law, and succession planning.', 400, 1, 3, 'core', '[]'),
('LAW 402', 'Family Law Practice', 'Marriage, divorce, child custody, adoption, domestic relations, and family dispute resolution.', 400, 1, 4, 'core', '[]'),
('LAW 403', 'Ghana Legal System', 'Structure of Ghana''s legal system, court hierarchy, legal institutions, and legal practice.', 400, 1, 3, 'core', '[]'),
('LAW 404', 'Human Rights and Freedoms', 'International and domestic human rights law, civil liberties, and human rights enforcement.', 400, 2, 3, 'core', '[]'),
('LAW 405', 'Immovable Property Law', 'Real estate law, land ownership, property rights, and immovable property transactions.', 400, 2, 3, 'core', '[]'),
('LAW 406', 'Intellectual Property Law', 'Patents, trademarks, copyrights, trade secrets, and intellectual property protection.', 400, 2, 3, 'elective', '[]'),
('LAW 407', 'IT Law', 'Information technology law, cybersecurity, data protection, and digital rights.', 400, 1, 3, 'elective', '[]'),
('LAW 408', 'Labour Law', 'Employment law, workers'' rights, industrial relations, and workplace regulations.', 400, 1, 3, 'elective', '[]'),
('LAW 409', 'Land Law', 'Land tenure systems, customary land law, land registration, and land use planning.', 400, 2, 3, 'elective', '[]'),
('LAW 410', 'Law and Accountable Institutions', 'Institutional accountability, governance, transparency, and institutional frameworks.', 400, 2, 3, 'elective', '[]'),
('LAW 411', 'Law of Advocacy and Legal Ethics', 'Professional conduct, legal ethics, advocacy skills, and lawyer-client relationships.', 400, 1, 2, 'core', '[]'),
('LAW 412', 'Law of Evidence', 'Rules of evidence, admissibility, burden of proof, and examination of witnesses.', 400, 2, 3, 'core', '[]'),
('LAW 413', 'Law of Torts', 'Civil wrongs, negligence, intentional torts, strict liability, and tort remedies.', 300, 1, 3, 'core', '[]'),
('LAW 414', 'Legal Aid', 'Access to justice, legal aid systems, pro bono services, and legal assistance programs.', 400, 1, 2, 'elective', '[]'),
('LAW 415', 'Media Law', 'Press freedom, media regulation, defamation, privacy, and communication law.', 400, 2, 3, 'elective', '[]'),
('LAW 416', 'Medical Law', 'Healthcare law, medical ethics, patient rights, and healthcare regulation.', 400, 2, 3, 'elective', '[]'),
('LAW 417', 'Natural Resources Law', 'Mining law, oil and gas law, water law, and natural resource management.', 400, 1, 3, 'elective', '[]'),
('LAW 418', 'Tax and Revenue Law', 'Income tax, corporate tax, VAT, customs duties, and tax administration.', 400, 2, 3, 'elective', '[]'),
('LAW 501', 'Legal Clinic I', 'Practical legal experience under supervision, client interaction, and case management.', 400, 1, 3, 'practical', '[]'),
('LAW 502', 'Legal Clinic II', 'Advanced practical legal experience and specialized case work.', 400, 2, 3, 'practical', '["LAW 501"]'),
('LAW 503', 'Moot Court', 'Appellate advocacy skills, oral argument, and brief writing.', 300, 2, 2, 'practical', '[]'),
('LAW 504', 'Trial Advocacy', 'Trial skills, witness examination, and courtroom procedures.', 400, 1, 3, 'practical', '[]'),
('LAW 601', 'Law Review', 'Legal scholarship, law journal editing, and academic legal writing.', 400, 1, 2, 'practical', '[]'),
('LAW 602', 'Independent Study', 'Self-directed research project under faculty supervision.', 400, 2, 3, 'elective', '[]');

-- Insert sample legal resources data
INSERT INTO legal_resources (title, type, category, jurisdiction, year, citation, summary, url, tags, relevant_courses) VALUES
('New Patriotic Party v. Attorney-General', 'case', 'Constitutional Law', 'Ghana', 2012, '[2012] 2 SCGLR 676', 'Landmark case on presidential election disputes and the jurisdiction of the Supreme Court in electoral matters.', null, '["constitutional law", "elections", "supreme court", "jurisdiction"]', '["LAW 301", "LAW 403"]'),
('Republic v. Tommy Thompson Books Ltd & Others', 'case', 'Criminal Law', 'Ghana', 2018, '[2018] DLSC 1234', 'Important ruling on corporate criminal liability and the prosecution of companies for criminal offenses.', null, '["criminal law", "corporate liability", "prosecution"]', '["LAW 304", "LAW 305", "LAW 204"]'),
('Constitution of the Republic of Ghana, 1992', 'statute', 'Constitutional Law', 'Ghana', 1992, null, 'The supreme law of Ghana establishing the framework of government and fundamental human rights.', null, '["constitution", "fundamental rights", "government structure"]', '["LAW 301", "LAW 403", "LAW 404"]'),
('Criminal Offences Act, 1960 (Act 29)', 'statute', 'Criminal Law', 'Ghana', 1960, null, 'Primary legislation defining criminal offenses and their punishments in Ghana.', null, '["criminal offenses", "punishment", "criminal code"]', '["LAW 304", "LAW 305"]'),
('Companies Act, 2019 (Act 992)', 'statute', 'Company Law', 'Ghana', 2019, null, 'Comprehensive legislation governing the incorporation and regulation of companies in Ghana.', null, '["company law", "incorporation", "corporate governance"]', '["LAW 204", "LAW 203"]'),
('Ghana Law Journal', 'journal', 'General Law', 'Ghana', 2023, null, 'Premier legal academic journal covering various aspects of Ghanaian and comparative law.', null, '["academic journal", "legal scholarship", "ghana law"]', '["LAW 601"]'),
('The Evolution of Contract Law in Ghana', 'article', 'Contract Law', 'Ghana', 2022, null, 'Comprehensive analysis of the development of contract law principles in Ghanaian jurisprudence.', null, '["contract law", "legal history", "jurisprudence"]', '["LAW 302", "LAW 203"]'),
('Tuffuor v. Attorney-General', 'case', 'Constitutional Law', 'Ghana', 1980, '[1980] GLR 637', 'Foundational case on the doctrine of separation of powers and judicial independence.', null, '["separation of powers", "judicial independence", "constitutional principles"]', '["LAW 301", "LAW 403"]'),
('Environmental Assessment Regulations, 1999 (L.I. 1652)', 'regulation', 'Environmental Law', 'Ghana', 1999, null, 'Regulations governing environmental impact assessments for development projects.', null, '["environmental law", "impact assessment", "development"]', '["LAW 306"]'),
('Ghanaian Constitutional Law: Principles and Practice', 'textbook', 'Constitutional Law', 'Ghana', 2021, null, 'Comprehensive textbook covering all aspects of Ghanaian constitutional law and practice.', null, '["constitutional law", "textbook", "legal education"]', '["LAW 301", "LAW 403"]);