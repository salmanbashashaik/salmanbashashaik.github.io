/* Single source of truth, transcribed from docs/resume-g.pdf. */

export const PROFILE = {
  name: "Shaik Salman Basha",
  short: "Salman Basha",
  locations: "Fredericton, NB / Waterloo, ON",
  phone: "(506) 897-3381",
  email: "sbashash@uwaterloo.ca",
  altEmail: "salmanbasha.shaik@unb.ca",
  linkedin: "https://www.linkedin.com/in/salmanbashashaik",
  github: "https://github.com/salmanbashashaik",
  resumePath: "/resume-g.pdf",
  paperUrl: "https://arxiv.org/abs/2606.25390",
  interests: `Large-scale pretraining of molecular foundation models, 3D latent diffusion
models for synthetic data generation, few-shot domain adaptation, and out-of-distribution
generalization. Building robust AI systems that transfer across data-scarce scientific
domains, with applications in drug discovery and medical imaging.`,
  roles: [
    "microbiome foundation models",
    "latent diffusion",
    "few-shot adaptation",
    "cross-cohort transfer",
  ],
};

export type Education = {
  school: string;
  place: string;
  degree: string;
  dates: string;
  status?: string;
  points: string[];
};

export const EDUCATION: Education[] = [
  {
    school: "University of Waterloo",
    place: "Waterloo, ON",
    degree: "MMath in Computer Science (Thesis)",
    dates: "09/2026 — 05/2028",
    status: "Admitted",
    points: [
      "Focus: Generative AI for Health and Medical Image Synthesis; currently conducting supervised research in the GenAI for Health Lab under Dr. Helen Chen and Dr. Anita Layton.",
      "Will return to the MMath program following any research engagement.",
    ],
  },
  {
    school: "University of New Brunswick",
    place: "Fredericton, NB",
    degree: "BSc Computer Science, Honours (Minor: Mathematics)",
    dates: "01/2022 — 05/2026",
    points: [
      "GPA 3.72 / 4.0 · Dean's List (2022–2024, 2025–2026) · Alumni Undergraduate Scholarship.",
      "Coursework: Advanced Algorithms, Machine Learning, NLP, Artificial Intelligence.",
    ],
  },
];

export type Role = {
  title: string;
  org: string;
  dates: string;
  kind: "research" | "work";
  points: string[];
};

export const RESEARCH: Role[] = [
  {
    title: "Gut4Heart — microbiome foundation model",
    org: "First author · GenAI for Health Lab, University of Waterloo",
    dates: "2026 — Present",
    kind: "research",
    points: [
      "Predicting cardiovascular disease and type 2 diabetes from gut-microbiome genus-abundance profiles, using a transformer whose pretraining prior is a hierarchical biological knowledge graph rather than a flat taxon co-occurrence graph.",
      "Built the knowledge graph (15 node types, 23 relation types, ~2.9K nodes) spanning taxon → enzyme → pathway → metabolite → receptor → disease, bridging 991 of 1,041 genera to graph-derived embeddings.",
      "A frozen R-GCN with a ComplEx decoder initializes the transformer's genus embedding table; the 5.1M-parameter backbone is pretrained by masked genus prediction over AGP, HMP, and MGnify.",
      "Central result: graph initialization wins 9 of 10 leave-one-cohort-out transfer pairs against random initialization, and beats the strongest random-forest baselines where feature-vocabulary mismatch is highest.",
      "Controls carry the mechanism: rotation and reflection isometries preserve the transfer advantage, while a structurally-identical shuffled knowledge graph does not — the biology is doing the work, not the geometry.",
    ],
  },
  {
    title: "Research Assistant — ChemFLM",
    org: "GenAI for Health Lab, University of Waterloo",
    dates: "03/2026 — Present",
    kind: "research",
    points: [
      "Virtual screening for protein-binder prediction with a Fingerprint Language Model, converting sparse molecular fingerprints into dense token sequences over a 4.4M-molecule corpus.",
      "Flagged a modelling issue in the process: fingerprint tokens are orderless, so rotary position embeddings encode a sequence structure the data does not have.",
    ],
  },
  {
    title: "Undergraduate Thesis Researcher",
    org: "University of New Brunswick",
    dates: "2025 — 2026",
    kind: "research",
    points: [
      "Designed a Few-Shot Cross-Domain framework combining 3D cGANs and Latent Diffusion Models to synthesize pediatric diffuse glioma MRI; classifier AUC > 0.94 in 10-shot and 16-shot settings.",
      "Engineered PyTorch/MONAI pipelines with SPADE-conditioned generators trained on 112³ MRI crops; resolved mode collapse via source-only diffusion pretraining plus few-shot VAE fine-tuning.",
      "Ran ablations across 8/10/16-shot regimes (guidance scale, conditional dropout, latent normalization), evaluated with FID, SSIM, and downstream CNN tumor classification.",
      "Accepted at Canadian AI 2026 as first author.",
    ],
  },
];

export const WORK: Role[] = [
  {
    title: "Bioinformatics Data Engineer Intern",
    org: "Agriculture and Agri-Food Canada",
    dates: "01/2025 — Present",
    kind: "work",
    points: [
      "Designed an ETL pipeline migrating structured genomic metadata from Elasticsearch to PostgreSQL; accelerated ingestion 24× (11 → 260 files/sec) via multiprocessing and I/O optimization.",
      "Benchmarked SpaCy, SciSpacy, and BioBERT for biomedical NER over genomic metadata; deployed the optimal configuration on F1 and inference speed.",
      "Ensured FAIR data compliance across high-throughput sequencing files in a production HPC environment (Compute Canada).",
    ],
  },
  {
    title: "Software Engineer Intern",
    org: "New Brunswick Power Corporation",
    dates: "09/2023 — 04/2024",
    kind: "work",
    points: [
      "Built multi-module enterprise applications in C#/.NET, integrating reporting systems into SAP infrastructure; delivered real-time dashboards in Power BI and Tableau.",
      "Optimized data retrieval with complex SQL schemas and queries; automated backend batch processes for cross-departmental data synchronization.",
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  org?: string;
  dates: string;
  blurb: string;
  points: string[];
  tags: string[];
  /** which interactive visual accompanies this project */
  viz: "mri" | "glucose" | "pipeline";
  link?: { label: string; href: string };
};

export const PROJECTS: Project[] = [
  {
    id: "mri",
    title: "Few-Shot Cross-Domain 3D MRI Synthesis",
    org: "Undergraduate thesis · University of New Brunswick",
    dates: "2025 — 2026",
    blurb:
      "Synthesizing pediatric diffuse glioma MRI when almost no pediatric data exists — by learning the anatomy from adult scans and adapting on a handful of examples.",
    points: [
      "3D cGANs plus Latent Diffusion Models under a shared latent space; SPADE-conditioned generators on 112³ crops.",
      "Mode collapse resolved through source-only diffusion pretraining followed by few-shot VAE fine-tuning.",
      "Downstream classifier AUC > 0.94 at 10 and 16 shots; ablations on guidance scale, conditional dropout, latent normalization.",
    ],
    tags: ["PyTorch", "MONAI", "Latent Diffusion", "cGAN", "SPADE", "FID / SSIM"],
    viz: "mri",
    link: { label: "Read the paper on arXiv", href: "https://arxiv.org/abs/2606.25390" },
  },
  {
    id: "rl-t1d",
    title: "Reinforcement Learning for Type 1 Diabetes Insulin Dosing",
    dates: "2024 — 2025",
    blurb:
      "Teaching a policy to dose insulin without ever driving a patient hypoglycemic — where the reward function matters more than the algorithm.",
    points: [
      "Fine-tuned PPO and GRPO agents in the OhioT1DM simulator with a custom reward penalizing hypoglycemic events below 70 mg/dL.",
      "Benchmarked PPO against GRPO across patient profiles, analyzing where dosing policies diverge under different glycemic baselines.",
      "Evaluated safety and generalization on real OhioT1DM time-series, measuring time-in-range across held-out cohorts.",
    ],
    tags: ["PPO", "GRPO", "Stable Baselines3", "OhioT1DM", "Reward design"],
    viz: "glucose",
  },
  {
    id: "sdi",
    title: "Science Data Inventory",
    org: "Agriculture and Agri-Food Canada",
    dates: "2025",
    blurb:
      "Making thousands of raw biological datasets findable — metadata extraction, biomedical NER, and primer detection over large FASTQ corpora.",
    points: [
      "Python extraction pipeline over thousands of raw datasets; benchmarked SpaCy, SciSpacy, and BioBERT for genomic searchability.",
      "Enriched metadata integrated into a CKAN portal under FAIR principles with structured schema alignment.",
      "Primer detection system classifying 16S/18S rRNA types by length, mismatch count, and read-position scoring.",
      "Automated sequencing-machine and omics-type detection (WGS, amplicon, metatranscriptomic) from raw headers for downstream routing.",
    ],
    tags: ["Elasticsearch", "PostgreSQL", "BioBERT", "CKAN", "FAIR", "HPC"],
    viz: "pipeline",
  },
];

export type Publication = {
  authors: string;
  status: string;
  tone: "accepted" | "pending";
  title: string;
  venue: string;
  note?: string;
  href?: string;
};

export const PUBLICATIONS: Publication[] = [
  {
    authors: "Basha, S. S.",
    status: "Accepted",
    tone: "accepted",
    title:
      "Few-Shot Cross-Domain 3D MRI Synthesis for Pediatric Diffuse Glioma Using Latent Diffusion Models",
    venue: "Canadian AI 2026",
    note: "First author",
    href: "https://arxiv.org/abs/2606.25390",
  },
  {
    authors: "Basha, S. S., et al.",
    status: "In preparation",
    tone: "pending",
    title:
      "A Knowledge-Graph-Initialized Microbiome Foundation Model for Cross-Cohort Cardiometabolic Disease Prediction",
    venue: "Targeting AAAI 2027",
    note: "First author · Gut4Heart",
  },
];

/* Skills, arranged as a graph: each node belongs to a cluster, and the
   clusters are what the molecule visual bonds together. */
export type SkillCluster = {
  id: string;
  label: string;
  note: string;
  items: string[];
};

export const SKILLS: SkillCluster[] = [
  {
    id: "lang",
    label: "Languages",
    note: "Python primary",
    items: ["Python", "Java", "C#", "SQL"],
  },
  {
    id: "ml",
    label: "ML / Deep Learning",
    note: "training & serving",
    items: [
      "PyTorch",
      "MONAI",
      "HuggingFace",
      "Stable Baselines3",
      "CUDA",
      "Docker GPU",
    ],
  },
  {
    id: "research",
    label: "Research Methods",
    note: "generative & evaluation",
    items: [
      "3D Latent Diffusion",
      "cGANs",
      "SPADE",
      "ModernBERT",
      "FID / SSIM",
      "DICOM",
      "NIfTI",
    ],
  },
  {
    id: "infra",
    label: "Data & Infrastructure",
    note: "pipelines at scale",
    items: [
      "Elasticsearch",
      "PostgreSQL",
      "Docker",
      "Logstash",
      "Hadoop",
      "Jupyter",
      "Power BI",
      "Compute Canada",
    ],
  },
];

export const CERTS = [
  "Kaggle Notebooks Expert — Top 6%",
  "HackerRank SQL (Advanced)",
  "Lean Six Sigma",
];

export const METRICS = [
  { value: 9, decimals: 0, prefix: "", suffix: " / 10", label: "cross-cohort transfer pairs won" },
  { value: 0.94, decimals: 2, prefix: "AUC > ", suffix: "", label: "10-shot glioma classifier" },
  { value: 991, decimals: 0, prefix: "", suffix: "", label: "genera bridged to the knowledge graph" },
  { value: 24, decimals: 0, prefix: "", suffix: "×", label: "ETL ingestion speed-up" },
];
