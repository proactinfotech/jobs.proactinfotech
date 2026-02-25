-- ============================================================
-- FULL DATABASE SETUP for Proact Infotech Jobs
-- Run this entire script in Supabase SQL Editor (new project)
-- ============================================================

-- ============ 1. TABLES, RLS & POLICIES ============

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'full-time',
  experience TEXT NOT NULL DEFAULT '',
  posted_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  responsibilities TEXT[] DEFAULT '{}',
  salary TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = true);

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT,
  experience TEXT NOT NULL DEFAULT '',
  why_interested TEXT NOT NULL DEFAULT '',
  earliest_joining_date DATE,
  why_role_fits TEXT NOT NULL DEFAULT '',
  why_us TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT,
  github_url TEXT,
  other_social_links TEXT,
  heard_from TEXT,
  open_to_paid TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin policies for jobs
CREATE POLICY "Admins can insert jobs" ON public.jobs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update jobs" ON public.jobs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete jobs" ON public.jobs FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all jobs" ON public.jobs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============ 2. STORAGE ============

INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Users can upload own resumes" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users and admins can view resumes" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::app_role)));

CREATE POLICY "Users can delete own resumes" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============ 3. CONSTRAINTS ============

ALTER TABLE public.applications
  ADD CONSTRAINT chk_app_first_name_len CHECK (length(first_name) <= 100),
  ADD CONSTRAINT chk_app_last_name_len CHECK (length(last_name) <= 100),
  ADD CONSTRAINT chk_app_email_fmt CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT chk_app_phone_len CHECK (length(phone) <= 30),
  ADD CONSTRAINT chk_app_experience_len CHECK (length(experience) <= 500),
  ADD CONSTRAINT chk_app_why_interested_len CHECK (length(why_interested) <= 2000),
  ADD CONSTRAINT chk_app_why_role_fits_len CHECK (length(why_role_fits) <= 2000),
  ADD CONSTRAINT chk_app_why_us_len CHECK (length(why_us) <= 2000);

ALTER TABLE public.contact_messages
  ADD CONSTRAINT chk_contact_first_name_len CHECK (length(first_name) <= 100),
  ADD CONSTRAINT chk_contact_last_name_len CHECK (length(last_name) <= 100),
  ADD CONSTRAINT chk_contact_email_fmt CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT chk_contact_message_len CHECK (length(message) <= 2000);

-- ============ 4. SEED JOBS ============

INSERT INTO jobs (title, department, location, type, experience, posted_date, description, tags, requirements, responsibilities, salary, is_active) VALUES

-- 1. Full Stack Developer Intern
(
  'Full Stack Developer Intern',
  'Product & Engineering',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Cluster Builds is building an AI-powered ecommerce platform for custom PC building. As a Full Stack Intern, you''ll work directly on the core platform — build configurator, user dashboards, pricing engine integration, and AI assistant interface. You will help build the foundation of the product used by real users.',
  ARRAY['React', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Tailwind CSS', 'JWT', 'Stripe', 'Supabase', 'Firebase'],
  ARRAY['Built at least 1–2 deployed web projects', 'Understanding of REST APIs', 'Basic understanding of databases', 'Familiarity with Git and GitHub workflows'],
  ARRAY['Develop frontend interfaces for PC build configurator', 'Connect frontend to backend APIs', 'Implement authentication (JWT/OAuth)', 'Integrate real-time pricing APIs', 'Build user dashboard for saved builds (BuildDeck)', 'Optimize performance and responsiveness'],
  NULL,
  true
),

-- 2. Backend & Database Engineering Intern
(
  'Backend & Database Engineering Intern',
  'Core Systems',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'This role focuses on building the compatibility engine behind ClusterAI. You''ll design and manage the database system that ensures CPUs, GPUs, RAM, PSUs, and cases all work together correctly. This is the backbone of the product.',
  ARRAY['PostgreSQL', 'SQL', 'Python', 'Node.js', 'ER Modeling', 'Graph Relationships'],
  ARRAY['Strong understanding of SQL', 'Knowledge of relational database design', 'Understanding of normalization & indexing', 'Built at least 1 backend-heavy project'],
  ARRAY['Design relational database schema for PC components', 'Implement compatibility logic (CPU ↔ Motherboard, GPU ↔ PSU, etc.)', 'Build PSU wattage calculator', 'Implement bottleneck detection logic', 'Optimize database queries'],
  NULL,
  true
),

-- 3. AI/ML Intern – Recommender Systems
(
  'AI/ML Intern – Recommender Systems',
  'ClusterAI',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Work on the intelligence engine of Cluster Builds. You will develop performance prediction models (FPS estimation), price-performance scoring systems, and recommendation engines. You will directly shape how smart ClusterAI becomes.',
  ARRAY['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'LightGBM', 'Numpy', 'Matplotlib'],
  ARRAY['Strong Python skills', 'Experience with at least one ML project', 'Understanding of regression models', 'Familiarity with evaluation metrics'],
  ARRAY['Build ML models for FPS prediction', 'Develop price-to-performance scoring', 'Implement build longevity scoring', 'Build recommender logic for budget builds', 'Evaluate model accuracy'],
  NULL,
  true
),

-- 4. Data Engineering & Scraping Intern
(
  'Data Engineering & Scraping Intern',
  'Data & Infrastructure',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'ClusterAI runs on data. You will collect real-time price data, benchmark data, and component specifications from online sources and structure them into usable datasets. Without this role, the AI cannot function.',
  ARRAY['Python', 'BeautifulSoup', 'Scrapy', 'APIs', 'Pandas', 'Cron Jobs', 'Automation'],
  ARRAY['Strong Python fundamentals', 'Experience scraping at least one website', 'Basic understanding of APIs', 'Data cleaning knowledge'],
  ARRAY['Scrape pricing data from ecommerce platforms', 'Maintain benchmark datasets', 'Clean and normalize component data', 'Automate daily/weekly data updates', 'Build ETL pipelines'],
  NULL,
  true
),

-- 5. Growth & Content Marketing Intern
(
  'Growth & Content Marketing Intern',
  'Growth & Community',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Drive user acquisition for Cluster Builds. You''ll create engaging tech content around PC builds, gaming rigs, productivity machines, and AI setups. You''ll help position Cluster Builds as: "The AI Brain for Custom PC Building."',
  ARRAY['Canva', 'CapCut', 'Premiere Pro', 'Instagram', 'YouTube', 'Reddit', 'SEO'],
  ARRAY['Experience managing a social media page', 'Understanding of gaming/PC ecosystem', 'Basic Canva or video editing skills', 'Analytical mindset'],
  ARRAY['Create Instagram & YouTube Shorts content', 'Publish "Best PC Build Under ₹X" posts', 'Manage Reddit & Discord community', 'Collaborate with micro-influencers', 'Track user growth metrics'],
  NULL,
  true
),

-- 6. Affiliate & Partnerships Intern
(
  'Affiliate & Partnerships Intern',
  'Business & Revenue',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Responsible for monetization and partnerships. You will explore affiliate programs, negotiate collaborations, and build brand relationships. This role directly impacts revenue.',
  ARRAY['Google Sheets', 'Email Marketing', 'Affiliate Dashboards', 'Analytics'],
  ARRAY['Strong communication skills', 'Email outreach experience (preferred)', 'Understanding of affiliate marketing', 'Analytical mindset'],
  ARRAY['Set up and manage affiliate programs', 'Track conversion performance', 'Outreach to PC hardware brands', 'Research sponsorship opportunities', 'Analyze revenue per build'],
  NULL,
  true
),

-- 7. Distributed Systems Engineering Intern
(
  'Distributed Systems Engineering Intern',
  'Core Infrastructure',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Cluster Cloud is building a decentralized compute marketplace that connects idle home PCs to users who need scalable compute power. As a Distributed Systems Intern, you will help design and build the orchestration engine that distributes workloads across multiple nodes securely and efficiently. You will work on scheduling, task distribution, node reliability, and system scalability.',
  ARRAY['Go', 'Python', 'Docker', 'Kubernetes', 'gRPC', 'REST APIs', 'Redis', 'PostgreSQL', 'Ray', 'Apache Spark'],
  ARRAY['Strong understanding of computer networks', 'Understanding of distributed systems fundamentals', 'Knowledge of concurrency and multithreading', 'Experience with backend systems development', 'Familiarity with Linux environments'],
  ARRAY['Design and implement job scheduling systems', 'Develop resource allocation algorithms', 'Work on distributed task splitting & aggregation', 'Build node health monitoring systems', 'Optimize for latency and reliability', 'Implement reliability scoring mechanisms'],
  NULL,
  true
),

-- 8. Node Agent / Systems Software Intern
(
  'Node Agent / Systems Software Intern',
  'Node Runtime Engineering',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'This role focuses on building the lightweight agent software installed on contributor PCs. The agent will detect hardware specs, securely execute workloads in sandboxed environments, and report metrics back to the Cluster Cloud network. This is a systems-level role.',
  ARRAY['Go', 'Rust', 'Docker', 'OS Programming', 'System Monitoring', 'Networking', 'Electron'],
  ARRAY['Strong programming skills', 'Understanding of operating systems', 'Knowledge of virtualization concepts', 'Familiarity with Linux or Windows internals'],
  ARRAY['Develop lightweight node agent software', 'Implement secure container-based execution', 'Detect and report hardware specs (CPU, GPU, RAM)', 'Monitor uptime and performance metrics', 'Implement resource throttling (CPU/GPU limits)', 'Ensure host system isolation'],
  NULL,
  true
),

-- 9. DevOps & Infrastructure Intern
(
  'DevOps & Infrastructure Intern',
  'Platform Engineering',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Cluster Cloud requires reliable orchestration, monitoring, and deployment systems. As a DevOps Intern, you will help build CI/CD pipelines, manage infrastructure, and ensure the platform scales efficiently.',
  ARRAY['Docker', 'Kubernetes', 'Nginx', 'Prometheus', 'Grafana', 'GitHub Actions', 'AWS', 'GCP'],
  ARRAY['Understanding of cloud infrastructure basics', 'Familiarity with Linux servers', 'Basic networking knowledge', 'Experience deploying applications'],
  ARRAY['Deploy backend services', 'Configure container orchestration', 'Set up monitoring & logging systems', 'Implement auto-scaling mechanisms', 'Maintain uptime dashboards', 'Optimize infrastructure cost'],
  NULL,
  true
),

-- 10. Security Engineering Intern
(
  'Security Engineering Intern',
  'Security & Trust',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'Security is critical for Cluster Cloud. This role focuses on sandboxing workloads, securing communication, encrypting job payloads, and preventing malicious execution on contributor machines. You will work on designing secure-by-default infrastructure.',
  ARRAY['TLS', 'SSL', 'JWT', 'OAuth', 'Docker Security', 'Firewalls', 'Linux Security', 'Penetration Testing', 'Zero Trust'],
  ARRAY['Understanding of encryption fundamentals', 'Knowledge of network security basics', 'Familiarity with authentication systems', 'Interest in cybersecurity'],
  ARRAY['Implement encrypted communication protocols', 'Design workload sandboxing systems', 'Conduct vulnerability analysis', 'Develop authentication & authorization flows', 'Implement secure key management', 'Monitor potential abuse patterns'],
  NULL,
  true
),

-- 11. Backend Platform Intern
(
  'Backend Platform Intern',
  'Broker & Marketplace',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'This role focuses on building the broker layer that connects compute demand with supply. You will build APIs that match users to nodes, manage job execution states, and handle billing logic.',
  ARRAY['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'WebSockets', 'Payment Integration'],
  ARRAY['Experience building backend APIs', 'Understanding of database design', 'Knowledge of asynchronous programming', 'Basic understanding of payment systems'],
  ARRAY['Build REST APIs for job submission', 'Implement compute marketplace matching logic', 'Develop escrow payment tracking system', 'Implement node reliability scoring', 'Manage job lifecycle tracking'],
  NULL,
  true
),

-- 12. Research & Performance Intern
(
  'Research & Performance Intern',
  'Optimization & Modeling',
  'Remote / Hybrid',
  'internship',
  '0-1 years',
  '2026-02-20',
  'This role focuses on studying performance bottlenecks, latency optimization, distributed compute modeling, and economic modeling for pricing.',
  ARRAY['Python', 'Benchmarking', 'Data Analysis', 'Simulation Modeling'],
  ARRAY['Strong analytical mindset', 'Knowledge of algorithms', 'Basic performance profiling experience'],
  ARRAY['Analyze distributed workload performance', 'Develop latency optimization strategies', 'Model pricing strategies for compute', 'Study distributed task efficiency', 'Create benchmarking frameworks'],
  NULL,
  true
);
