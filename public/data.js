export const CATEGORIES = [
  { id: "community", label: "Community" },
  { id: "training", label: "Training & fellowships" },
  { id: "governance", label: "Governance" },
  { id: "research", label: "Research" },
  { id: "media", label: "Media & resources" },
  { id: "career", label: "Career support" }
];

// status "inactive" moves the pin to the graveyard islet. status "unclear" adds a badge to the card.
// An organization without an icon shows its initials on the pin.
export const ORGS = [
  {
    name: "Buenos Aires AI Safety Hub (BAISH)",
    short: "BAISH",
    category: "community",
    country: "Argentina",
    city: "Buenos Aires",
    url: "https://baish.com.ar",
    icon: "icons/baish.com.ar.png",
    description: "The region's largest AI safety community, founded 2024: free technical and governance courses with BlueDot Impact, research sprints, monthly socials, and BAISH Labs."
  },
  {
    name: "AI Safety México (AISMX)",
    short: "AISMX",
    category: "community",
    country: "Mexico",
    city: "Guadalajara",
    url: "https://www.aismx.org",
    icon: "icons/www.aismx.org.png",
    description: "Builds technical and governance AI safety capacity in Mexico, with chapters in Guadalajara and Yucatán: Spanish-language courses, hackathons with Apart Research, and VIGÍA, a pipeline tracking AI risk signals in the official gazette."
  },
  {
    name: "AI Safety Colombia",
    short: "AIS Colombia",
    category: "community",
    country: "Colombia",
    city: "Bogotá",
    url: "https://aisafetycolombia.org",
    icon: "icons/aisafetycolombia.org.png",
    description: "Community in Bogotá that helps people start careers in AI safety: BlueDot seminars facilitated in Spanish, hackathons and sprints with Apart Research, a fortnightly AI control reading group, and monthly research talks."
  },
  {
    name: "AI Safety Brazil",
    short: "AIS Brazil",
    category: "community",
    country: "Brazil",
    url: "https://aisafetybrazil.org",
    icon: "icons/aisafetybrazil.org.png",
    description: "Nonprofit community connecting professionals, researchers, and policy-makers who work on safe AI in Brazil, from applied AI ethics to frontier safety. Reports more than 1,400 members and runs regular events and meetups."
  },
  {
    name: "CHAIS — Chile AI Safety",
    short: "CHAIS",
    category: "community",
    country: "Chile",
    city: "Santiago",
    url: "https://chais.cl",
    icon: "icons/chais.cl.png",
    description: "Early-stage initiative building AI safety as a discipline in Chile, across technical research, governance, and training. Runs a weekly reading group and a resource index; training programs are in design."
  },
  {
    name: "AI Safety Initiative @ UC Chile (AISUC)",
    short: "AISUC",
    category: "community",
    country: "Chile",
    city: "Santiago",
    url: "https://aisuc.dev",
    icon: "icons/aisuc.dev.png",
    description: "The first student AI safety initiative in Chile. Supports students at UC Chile who want to enter the field and do research in it."
  },
  {
    name: "LANAIS — Latin American Network for AI Safety",
    short: "LANAIS",
    initials: "LA",
    category: "community",
    country: "Regional",
    url: "https://lanais-website.pages.dev",
    description: "Network connecting AI safety researchers and policy-makers across Latin America, with a people directory and local contacts by city. Its board and members come from six countries."
  },
  {
    name: "ImpactRIO",
    short: "ImpactRIO",
    initials: "IR",
    category: "community",
    country: "Brazil",
    city: "Rio de Janeiro",
    url: "https://www.linkedin.com/company/impact-rio",
    status: "inactive",
    description: "Brazil's first AI safety group, founded 2023: ran alignment and governance fellowships on BlueDot curricula before winding down."
  },
  {
    name: "AISAR — Becas de AI Safety Argentina",
    short: "AISAR",
    category: "training",
    country: "Argentina",
    city: "Buenos Aires",
    url: "https://scholarship.aisafety.ar",
    icon: "icons/scholarship.aisafety.ar.png",
    description: "Six-month funded AI safety research scholarships hosted at the UBA-CONICET computer science institute, with stipends, compute, and paid mentors. Second cohort started October 2026."
  },
  {
    name: "Apart Research — Global South hackathons",
    short: "Apart",
    category: "training",
    country: "Regional",
    url: "https://apartresearch.com",
    icon: "icons/apartresearch.com.png",
    description: "AI safety research sprints with physical hubs across the region, from Buenos Aires and Bogotá to Mérida and Florianópolis. Winning teams feed into Apart's fellowship."
  },
  {
    name: "ML4Good — LatAm bootcamps",
    short: "ML4Good",
    initials: "ML",
    category: "training",
    country: "Regional",
    url: "https://ml4good.org",
    description: "Free ten-day AI safety bootcamps; editions held in Brazil (2024) and Colombia (2025), open to participants across the region."
  },
  {
    name: "Condor Initiative",
    short: "Condor",
    initials: "CD",
    category: "training",
    country: "Brazil",
    url: "https://www.condorinitiative.org",
    status: "inactive",
    description: "Ran residential camps introducing top Brazilian students to AI safety careers, backed by Open Philanthropy. Wound down by 2026."
  },
  {
    name: "AI Futures Fellowship",
    short: "AIFF",
    category: "training",
    country: "Mexico",
    city: "Mexico City",
    url: "https://aifuturesfellowship.org",
    icon: "icons/aifuturesfellowship.org.png",
    status: "inactive",
    description: "Eight-week fellowship on catastrophic AI risks hosted at ITAM, with stipends and mentorship. Last cohort ran in early 2024."
  },
  {
    name: "CEBRI — AISO proposal",
    short: "CEBRI",
    category: "governance",
    country: "Brazil",
    city: "Rio de Janeiro",
    url: "https://cebri.org/en/doc/375/an-ai-safety-and-opportunities-institute-for-brazil-a-sketch-of-characteristics-functions-and-potential-challenges",
    icon: "icons/cebri.org.png",
    description: "Foreign-policy think tank behind the 2025 proposal for an AI Safety and Opportunities Institute (AISO) in Brazil, the region's most concrete AI-safety-institute design."
  },
  {
    name: "Centro de Estudos em Governança de IA (CEGIA)",
    short: "CEGIA",
    category: "governance",
    country: "Brazil",
    city: "Brasília",
    url: "https://cegia.org.br",
    icon: "icons/cegia.org.br.png",
    description: "Nonprofit working toward a safe transition to advanced AI: research on systemic risk, technical support for Brazil's AI bill, and Portuguese translations of AI safety materials."
  },
  {
    name: "Observatorio de Riesgos Catastróficos Globales (ORCG)",
    short: "ORCG",
    category: "research",
    country: "Regional",
    url: "https://www.orcg.info",
    icon: "icons/www.orcg.info.png",
    description: "Policy research network on global catastrophic risks for the Spanish-speaking world. AI risk is a core workstream, with reports on AI governance in Latin America and advocacy for international red lines."
  },
  {
    name: "RiesgosIA.org",
    short: "RiesgosIA",
    category: "media",
    country: "Regional",
    url: "https://riesgosia.org",
    icon: "icons/riesgosia.org.png",
    description: "Spanish-language reference on AI risks: a periodic table of 118 risks, a glossary, a career guide, and a mirror of the MIT AI Risk Repository. Also listed on the global field map."
  },
  {
    name: "HorizonteIA",
    short: "HorizonteIA",
    initials: "HI",
    category: "media",
    country: "Regional",
    url: "https://horizonte-ia.info",
    description: "Automated weekday AI briefing in Portuguese and Spanish covering frontier models, safety, and governance, built to break the English-language bubble."
  },
  {
    name: "Carreras con Impacto",
    short: "Carreras con Impacto",
    category: "career",
    country: "Regional",
    url: "https://carrerasconimpacto.org",
    icon: "icons/carrerasconimpacto.org.png",
    status: "unclear",
    description: "Spanish-language career organization mentoring students across the region toward work on global catastrophic risks, with AI safety and AI governance courses and a 16-week mentorship program."
  }
];
