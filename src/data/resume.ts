/* Single source of truth, from the latest résumé (Research_resume.pdf). */

export const PROFILE = {
  name: "Shaik Salman Basha",
  short: "Salman Basha",
  locations: "Waterloo, ON",
  phone: "(506) 897-3381",
  email: "sbashash@uwaterloo.ca",
  altEmail: "salmanbasha.shaik@unb.ca",
  linkedin: "https://www.linkedin.com/in/salmanbashashaik",
  github: "https://github.com/salmanbashashaik",
  resumePath: "/resume.pdf",
  paperUrl: "https://arxiv.org/abs/2606.25390",
  roles: [
    "microbiome foundation models",
    "molecular fingerprint LMs",
    "latent diffusion",
    "few-shot adaptation",
  ],
  interests: `Generative AI and representation learning for scientific domains, with emphasis on
molecular foundation models, generative medical imaging, latent diffusion models, few-shot domain
adaptation, and out-of-distribution generalization. Interested in robust learning systems that
transfer across data-scarce scientific domains, particularly drug discovery and medical imaging.`,
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
    dates: "09/2026 – 05/2028 (expected)",
    status: "Current",
    points: [
      "Research focus: Generative AI for Health.",
      "Supervisors: Dr. Helen Chen and Dr. Anita Layton.",
    ],
  },
  {
    school: "University of New Brunswick",
    place: "Fredericton, NB",
    degree: "BSc Computer Science, Honours (Minor: Mathematics)",
    dates: "01/2022 – 05/2026",
    points: [
      "GPA 3.72 / 4.0 · Dean's List · Alumni Undergraduate Scholarship.",
      "Coursework: Advanced Algorithms, Machine Learning, Natural Language Processing, Artificial Intelligence.",
    ],
  },
];

export type Role = {
  title: string;
  org: string;
  dates: string;
  kind: "research" | "work";
  summary: string;
  points: string[];
};

export const RESEARCH: Role[] = [
  {
    title: "Research Assistant",
    org: "GenAI for Health Lab, University of Waterloo",
    dates: "03/2026 – 08/2026",
    kind: "research",
    summary:
      "Co-authored DELBERT-2, a pretrained molecular fingerprint language model, and co-led a Type 2 Diabetes prediction initiative.",
    points: [
      "Co-authored DELBERT-2, a pretrained molecular fingerprint language model published at the ICML 2026 Workshop on Foundation Models for the Life Sciences (FM4LS), using ModernBERT for protein-binder prediction from DNA-encoded-library data.",
      "Developed virtual-screening experiments across six protein targets (WDR91, WDR12, SETDB1, PLCZ1, LRRK2, DCAF7), evaluating pretrained representations under chemical-novelty, cross-library, and compositional distribution shifts.",
      "Evaluated OOD generalization using hierarchical-cluster, library, and building-block splits; DELBERT-2 achieved 13.28× enrichment at top-100, improving over training without pretraining and substantially enriching hits over random selection.",
      "Investigated molecular fingerprint representation design and identified limitations in applying RoPE positional encodings to semantically orderless fingerprint-token sequences.",
      "Co-led a Type 2 Diabetes prediction research initiative, directing predictive-modeling experiments, model evaluation, and analysis of clinical risk prediction.",
    ],
  },
  {
    title: "Undergraduate Thesis Researcher",
    org: "University of New Brunswick",
    dates: "2025 – 2026",
    kind: "research",
    summary:
      "Few-shot cross-domain 3D MRI synthesis for pediatric glioma; first-author paper accepted at Canadian AI 2026.",
    points: [
      "Developed a few-shot cross-domain generative framework combining 3D conditional GANs and latent diffusion models for pediatric diffuse glioma MRI synthesis under severe target-domain data scarcity.",
      "Achieved downstream classifier AUC > 0.94 in 10-shot and 16-shot target-domain regimes, showing the value of synthetic data augmentation for low-resource medical imaging.",
      "Engineered end-to-end PyTorch/MONAI training pipelines on 112³ MRI volumes with SPADE-conditioned generators, latent diffusion, and few-shot VAE adaptation.",
      "Diagnosed and mitigated mode collapse through source-domain diffusion pretraining and few-shot VAE fine-tuning, improving training stability.",
      "Designed controlled ablations across 8/10/16-shot regimes (classifier-free guidance, conditional dropout, latent normalization); evaluated with FID, SSIM, and downstream CNN classification.",
      "First-author work accepted at Canadian AI 2026.",
    ],
  },
];

export const WORK: Role[] = [
  {
    title: "Bioinformatics Data Engineer Intern",
    org: "Agriculture and Agri-Food Canada",
    dates: "01/2025 – 04/2026",
    kind: "work",
    summary:
      "Genomic metadata pipelines and biomedical NER on an HPC cluster; 24× faster ingestion.",
    points: [
      "Architected a Python ETL pipeline for genomic metadata and improved ingestion throughput 24× (11 → 260 files/sec) using multiprocessing, batching, and I/O optimization.",
      "Benchmarked SpaCy, SciSpacy, and BioBERT for biomedical named-entity recognition and selected deployment configurations on F1-score and inference-throughput tradeoffs.",
      "Built scalable metadata extraction and biological sequence-classification workflows over high-throughput sequencing datasets in production HPC environments.",
      "Developed automated sequencing-platform, omics-type, and biological-primer detection pipelines for heterogeneous genomic data.",
      "Integrated enriched scientific metadata into structured data infrastructure while enforcing FAIR principles.",
    ],
  },
  {
    title: "Software Engineer Intern",
    org: "New Brunswick Power Corporation",
    dates: "09/2023 – 04/2024",
    kind: "work",
    summary: "Enterprise C#/.NET applications integrated with SAP.",
    points: [
      "Built multi-module enterprise applications in C#/.NET, integrating internal reporting systems with SAP infrastructure.",
      "Designed and optimized SQL-backed data workflows and automated backend processes supporting cross-departmental enterprise systems.",
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  org?: string;
  dates: string;
  kind: string;
  blurb: string;
  points: string[];
  tags: string[];
  viz?: "gut4heart" | "mri" | "glucose" | "pipeline";
  link?: { label: string; href: string };
};

export const PROJECTS: Project[] = [
  {
    id: "gut4heart",
    viz: "gut4heart",
    title: "Gut4Heart: knowledge-graph microbiome foundation model",
    org: "First author · GenAI for Health Lab, University of Waterloo",
    dates: "2026",
    kind: "Foundation model · Accepted at IEEE BIBM",
    blurb:
      "A transformer that predicts cardiovascular disease and type 2 diabetes from gut-microbiome profiles, initialized from a biological knowledge graph instead of a flat taxon graph.",
    points: [
      "Predicts cardiovascular disease and type 2 diabetes from genus-abundance profiles using a transformer whose pretraining prior is a hierarchical biological knowledge graph.",
      "Knowledge graph: 15 node types, 23 relation types, about 2.9K nodes spanning taxon → enzyme → pathway → metabolite → receptor → disease, bridging 991 of 1,041 genera.",
      "A frozen R-GCN with a ComplEx decoder initializes the genus embedding table; the 5.1M-parameter backbone is pretrained by masked genus prediction over AGP, HMP, and MGnify.",
      "Graph initialization wins 9 of 10 leave-one-cohort-out transfer pairs against random initialization, and beats the strongest random-forest baselines where vocabulary mismatch is highest.",
      "Controls: rotation and reflection isometries preserve the advantage, while a structurally identical shuffled graph does not. The biology is doing the work, not the geometry.",
    ],
    tags: ["R-GCN", "ComplEx", "Transformers", "Knowledge graphs", "Transfer learning"],
  },
  {
    id: "delbert",
    title: "DELBERT-2: fingerprint language models for DEL binder prediction",
    org: "Co-author · GenAI for Health Lab, University of Waterloo",
    dates: "2026",
    kind: "Molecular ML · ICML 2026 FM4LS workshop",
    blurb:
      "Pretrained ModernBERT on molecular fingerprints to find protein binders in DNA-encoded libraries, tested under hard distribution shifts.",
    points: [
      "Virtual screening across six protein targets: WDR91, WDR12, SETDB1, PLCZ1, LRRK2, DCAF7.",
      "Evaluated under chemical-novelty, cross-library, and compositional shifts using cluster, library, and building-block splits.",
      "13.28× enrichment at top-100, improving over training without pretraining.",
      "Found that RoPE encodes a sequence order that orderless fingerprint tokens do not have.",
    ],
    tags: ["ModernBERT", "DEL", "Fingerprints", "OOD evaluation", "Virtual screening"],
    link: { label: "Read the paper on arXiv", href: "https://arxiv.org/abs/2611.00281" },
  },
  {
    id: "mri",
    viz: "mri",
    title: "Few-shot cross-domain 3D MRI synthesis",
    org: "Undergraduate thesis · University of New Brunswick",
    dates: "2025 – 2026",
    kind: "Generative imaging · Accepted at Canadian AI 2026",
    blurb:
      "Synthesizing pediatric glioma MRI when almost no pediatric data exists, by learning anatomy from adult scans and adapting on a handful of examples.",
    points: [
      "3D cGANs plus latent diffusion models under a shared latent space; SPADE-conditioned generators on 112³ crops.",
      "Mode collapse resolved through source-only diffusion pretraining followed by few-shot VAE fine-tuning.",
      "Downstream classifier AUC > 0.94 at 10 and 16 shots; ablations on guidance scale, conditional dropout, latent normalization.",
    ],
    tags: ["PyTorch", "MONAI", "Latent diffusion", "cGAN", "SPADE", "FID / SSIM"],
    link: { label: "Read the paper on arXiv", href: "https://arxiv.org/abs/2606.25390" },
  },
  {
    id: "rl-t1d",
    viz: "glucose",
    title: "Reinforcement learning for type 1 diabetes insulin dosing",
    dates: "2024 – 2025",
    kind: "Reinforcement learning",
    blurb:
      "Teaching a policy to dose insulin without driving a patient hypoglycemic, where the reward function matters more than the algorithm.",
    points: [
      "Trained and evaluated PPO and GRPO agents in the OhioT1DM simulator with Stable Baselines3 and custom safety-aware rewards penalizing hypoglycemia (below 70 mg/dL).",
      "Compared policy behaviour across heterogeneous patient profiles.",
      "Evaluated generalization on held-out cohorts using clinical time-in-range and safety metrics.",
    ],
    tags: ["PPO", "GRPO", "Stable Baselines3", "OhioT1DM", "Reward design"],
  },
  {
    id: "sdi",
    viz: "pipeline",
    title: "Science Data Inventory",
    org: "Agriculture and Agri-Food Canada",
    dates: "2025",
    kind: "Data engineering",
    blurb:
      "Making thousands of raw biological datasets findable with metadata extraction, biomedical NER, and primer detection.",
    points: [
      "Python extraction pipeline over thousands of raw datasets; benchmarked SpaCy, SciSpacy, and BioBERT for genomic searchability.",
      "Enriched metadata integrated into a CKAN portal under FAIR principles.",
      "Primer detection classifying 16S/18S rRNA types by length, mismatch count, and read-position scoring.",
      "Automated sequencing-machine and omics-type detection (WGS, amplicon, metatranscriptomic) from raw headers.",
    ],
    tags: ["Elasticsearch", "PostgreSQL", "BioBERT", "CKAN", "FAIR", "HPC"],
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
    authors: "Basha, S. S., Hu, B. X., Sun, S., Layton, A., Chen, H. H.",
    status: "Poster",
    tone: "accepted",
    title: "DELBERT-2: Pretrained Fingerprint Language Models for DEL Protein Binder Prediction",
    venue: "ICML 2026 Workshop on Foundation Models for the Life Sciences (FM4LS)",
    note: "First author",
    href: "https://arxiv.org/abs/2611.00281",
  },
  {
    authors: "Basha, S. S., et al.",
    status: "Accepted",
    tone: "accepted",
    title:
      "Anatomically-conditioned Latent Diffusion Model for Data-Efficient Few-Shot Cross-Domain 3D Glioma MRI Synthesis",
    venue: "Canadian AI 2026",
    note: "First author",
    href: "https://arxiv.org/abs/2606.25390",
  },
  {
    authors: "Basha, S. S., et al.",
    status: "Accepted",
    tone: "accepted",
    title: "Knowledge Graph-Informed Foundation Model for Microbiome-Cardiovascular Disease Classification",
    venue: "IEEE BIBM",
    note: "First author",
  },
];

export type SkillCluster = { id: string; label: string; note: string; items: string[] };

export const SKILLS: SkillCluster[] = [
  { id: "lang", label: "Programming", note: "Python primary", items: ["Python", "Java", "C#", "SQL"] },
  {
    id: "ml",
    label: "ML / Deep learning", note: "training & serving",
    items: ["PyTorch", "MONAI", "HuggingFace Transformers", "Stable Baselines3", "CUDA", "ModernBERT"],
  },
  {
    id: "research",
    label: "Research methods", note: "generative & evaluation",
    items: [
      "Latent diffusion models",
      "Conditional GANs",
      "SPADE conditioning",
      "Representation learning",
      "Masked language modeling",
      "OOD evaluation",
      "Reinforcement learning",
      "Few-shot learning",
    ],
  },
  {
    id: "eval",
    label: "Evaluation", note: "how results are judged",
    items: ["FID", "SSIM", "ROC-AUC", "PR-AUC", "NDCG", "Enrichment factor", "Downstream classification"],
  },
  {
    id: "infra",
    label: "Systems / Infrastructure", note: "pipelines at scale",
    items: ["Docker", "PostgreSQL", "Elasticsearch", "Logstash", "Linux", "Git", "HPC / Compute Canada"],
  },
  {
    id: "data",
    label: "Scientific data", note: "scientific formats",
    items: ["DICOM", "NIfTI", "Molecular fingerprints", "DNA-encoded libraries", "High-throughput sequencing"],
  },
];

export const CERTS = [
  "Kaggle Notebooks Expert, top 6%",
  "HackerRank SQL (Advanced)",
  "Lean Six Sigma",
];

export const METRICS = [
  { value: 13.28, decimals: 2, prefix: "", suffix: "×", label: "hit enrichment at top-100 (DELBERT-2)" },
  { value: 9, decimals: 0, prefix: "", suffix: " / 10", label: "cross-cohort transfer pairs won" },
  { value: 0.94, decimals: 2, prefix: "AUC > ", suffix: "", label: "10-shot glioma classifier" },
  { value: 24, decimals: 0, prefix: "", suffix: "×", label: "ETL ingestion speed-up" },
];

export const PERSONAL = {
  intro:
    "Away from the keyboard I'm usually on a tennis court, deep in a book, or losing to my brother at something.",
  items: [
    { label: "Tennis", text: "My main way to reset. I play whenever the weather and my schedule allow." },
    { label: "Reading", text: "Sometimes. I read in bursts, and then not at all for a while." },
    { label: "Gaming", text: "Mostly with my brother, which is how I stay close from far away." },
    {
      label: "Home: Nellore and Fredericton",
      text: "Nellore is where I'm from, and I miss the food, especially chepala pulusu, a tangy tamarind fish curry. Fredericton is where I studied, and I miss its beautiful trails.",
    },
  ],
  movies: [
    { title: "Parasite", note: "Bong Joon-ho, 2019" },
    { title: "Snowpiercer", note: "Bong Joon-ho, 2013" },
    { title: "The Platform", note: "Galder Gaztelu-Urrutia, 2019" },
  ],
  movieBlurb:
    "My favourite genre is the class-struggle thriller: films that use a tight, strange setting to say something sharp about who gets what.",
};
