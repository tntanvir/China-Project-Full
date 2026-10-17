import { fullPagePhrases } from "./translation-dictionary";
import { sourceDictionary } from "./i18n";
import { localeOverrides, localizedNavItems } from "./locales/index";

/**
 * Universal Reverse Translation Dictionary
 * Maps any foreign translated phrase (French, Chinese, Spanish, German, etc.)
 * directly back to its exact English source text.
 */
const reverseMap = new Map<string, string>();
const lowerReverseMap = new Map<string, string>();
const englishPhrasesSet = new Set<string>();

// 1. Index all authentic English phrases and words so they are NEVER overwritten
function indexEnglishPhrases(obj: unknown) {
  if (!obj) return;
  if (typeof obj === "string") {
    const trimmed = obj.trim().toLowerCase();
    if (trimmed.length > 0) {
      englishPhrasesSet.add(trimmed);
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(indexEnglishPhrases);
    return;
  }
  if (typeof obj === "object") {
    Object.values(obj).forEach(indexEnglishPhrases);
  }
}

// Index sourceDictionary and fullPagePhrases English keys
indexEnglishPhrases(sourceDictionary);
Object.keys(fullPagePhrases).forEach((key) => {
  englishPhrasesSet.add(key.trim().toLowerCase());
});

// Explicitly protect common shared English keywords from ever being replaced
const protectedEnglishWords = [
  "express",
  "fast turn",
  "standard",
  "turnkey",
  "faq",
  "pcb",
  "smt",
  "pcba",
  "overview",
  "equipments",
  "prototype",
  "testing",
  "service",
  "contact",
  "home",
  "products",
  "capability",
  "capabilities",
  "welcome",
  "news",
  "careers",
  "team",
  "quality",
  "top rated",
  "certified",
  "100% tested",
  "special",
  "live",
];
protectedEnglishWords.forEach((w) => englishPhrasesSet.add(w.toLowerCase()));

function registerPair(foreignText: string, englishText: string) {
  if (!foreignText || !englishText) return;
  const fTrimmed = foreignText.trim();
  const eTrimmed = englishText.trim();
  if (fTrimmed.length < 2 || fTrimmed === eTrimmed) return;

  // CRITICAL: If the "foreign" phrase is actually a valid English phrase, do NOT map it!
  // (Prevents bugs like mapping the English word "Express" to "Fast Turn")
  if (englishPhrasesSet.has(fTrimmed.toLowerCase())) {
    return;
  }

  reverseMap.set(fTrimmed, eTrimmed);
  lowerReverseMap.set(fTrimmed.toLowerCase(), eTrimmed);
}

// 2. Populate from fullPagePhrases
Object.entries(fullPagePhrases).forEach(([englishKey, translations]) => {
  Object.values(translations).forEach((foreignVal) => {
    if (foreignVal && typeof foreignVal === "string") {
      registerPair(foreignVal, englishKey);
    }
  });
});

// 3. Recursively extract pairs from sourceDictionary vs localeOverrides
function deepExtract(source: unknown, override: unknown) {
  if (!source || !override) return;

  if (typeof source === "string" && typeof override === "string") {
    registerPair(override, source);
    return;
  }

  if (Array.isArray(source) && Array.isArray(override)) {
    source.forEach((item, index) => {
      deepExtract(item, override[index]);
    });
    return;
  }

  if (
    typeof source === "object" &&
    typeof override === "object" &&
    !Array.isArray(source) &&
    !Array.isArray(override)
  ) {
    const srcObj = source as Record<string, unknown>;
    const ovrObj = override as Record<string, unknown>;

    Object.keys(ovrObj).forEach((key) => {
      if (key in srcObj) {
        deepExtract(srcObj[key], ovrObj[key]);
      }
    });
  }
}

// Extract for all locale overrides (French, Bengali, Chinese, German, etc.)
Object.values(localeOverrides).forEach((override) => {
  deepExtract(sourceDictionary, override);
});

// 4. Extract navigation items pairs
const sourceNav = sourceDictionary.navbar.navItems;
Object.values(localizedNavItems).forEach((navItems) => {
  navItems.forEach((item, index) => {
    const srcItem = sourceNav[index];
    if (srcItem) {
      registerPair(item.title, srcItem.title);
      item.items.forEach((sub, subIdx) => {
        const srcSub = srcItem.items[subIdx];
        if (srcSub) {
          registerPair(sub, srcSub);
        }
      });
    }
  });
});

// 5. Hardcoded high-priority French phrases fallback to guarantee zero leakage
const explicitFrenchMap: Record<string, string> = {
  "Partenaire direct d'usine PCB & PCBA": "Direct Factory PCB & PCBA Partner",
  "Régions du monde": "Global Region",
  "Choisir le pays et la langue": "Select Country / Language",
  "Navigation": "Navigation",
  "Explorer": "Explore",
  "Connexion": "Login",
  "Feitian PCB en un coup d'œil": "Explore Feitian PCB at a Glance",
  "Usine directe de 18 000 m² en salle blanche, assemblage CMS et support technique.":
    "Direct manufacturing factory, cleanroom capabilities, and customer support.",
  "Bienvenue": "Welcome",
  "Actualités": "News & Updates",
  "Carrières": "Careers",
  "Changer le thème": "Toggle Theme",
  "Clair": "Light",
  "Sombre": "Dark",
  "Système": "System",
  "Bienvenue chez Feitian PCB": "Welcome to Feitian PCB",
  "Choisissez un pays dans la barre de navigation pour traduire instantanément l'intégralité du site.":
    "Choose a country from the navbar to translate the entire website dynamically.",
  "Langue actuelle": "Current Language",
  "Usine directe • Circuits imprimés multicouches et PCBA clé en main":
    "Precision PCB & Turnkey PCBA Direct Factory",
  "Fabrication de PCB et assemblage CMS fiables pour l'électronique moderne.":
    "Reliable PCB Production & SMT Assembly for Modern Electronics.",
  "Devis immédiat en ligne": "Instant PCB Quote",
  "Explorer nos produits": "Explore Products",
  "Du prototype à la série": "Prototype to Volume",
  "100% E-Test & AOI": "100% E-Testing",
  "Standards IPC Classe 2/3": "IPC Class 2/3",
  "Contrôle direct en usine, des fichiers Gerber à la livraison mondiale":
    "Direct Factory Control from Digital Gerber to Global Delivery",
  "Visite vidéo de l'usine connectée": "Smart Factory Tour Video",
  "Catégories de produits PCB & PCBA": "PCB & PCBA Product Categories",
  "Toutes les catégories": "All Products",
  "Vidéo de présentation des produits": "Product Showcase Video",
  "PCB rigide multicouche": "Rigid Multi-Layer PCB",
  "Circuits flexibles (FPC)": "Flexible Circuits (FPC)",
  "PCB rigide-flexible": "Rigid-Flex PCB",
  "PCB à cœur aluminium MCPCB": "Aluminum MCPCB",
  "Circuits haute fréquence Rogers": "High-Frequency Rogers PCB",
  "Microvias HDI Any-Layer": "Any-Layer HDI Microvia",
  "Capacités avancées de production PCB & CMS":
    "Advanced PCB & SMT Manufacturing Capabilities",
  "Services complets d'assemblage de circuits et approvisionnement BOM":
    "Full Turnkey PCB Assembly Services",
  "Contrôle qualité rigoureux zéro défaut à chaque étape":
    "Rigorous Zero-Defect Quality Control at Every Process",
  "La confiance des équipes matérielles critiques à travers le monde":
    "Trusted by Mission-Critical Electronics Teams Globally",
  "Site de fabrication automatisé en salle blanche":
    "Automated Cleanroom Manufacturing Plant",
  "Prêt à lancer la fabrication de votre circuit imprimé ?":
    "Ready to Start Your PCB or PCBA Build?",
  "Contacter le service commercial": "Contact Sales Engineering",
  "Support technique 24/7": "24/7 Technical Support",
  "Express aérien mondial • Connexions directes":
    "Worldwide Air Express • Direct Connecting Flight Links",
  "Chaîne d'approvisionnement mondiale de précision PCB & PCBA":
    "Global Precision PCB & PCBA Supply Chain",
  "Avis vérifiés d'ingénieurs matériels":
    "Verified Hardware Engineering Reviews",
  "Ce que disent les équipes d'ingénierie mondiales":
    "What Global Hardware Teams Say",
  "À propos": "About Us",
  "Familles de produits": "Product Families",
  "Capacités": "Capabilities",
  "Contact usine": "Contact Factory",
  "Adresse de l'usine": "Factory Address",
  "Téléphone direct": "Direct Phone",
  "E-mail technique": "Engineering Email",
  "1-32 couches • FR4 rigide": "1-32 Layers • Rigid FR4",
  "Calculateur en ligne immédiat PCB & PCBA": "Fast PCB & PCBA Instant Quote",
  "PCB standard": "Standard PCB",
  "Assemblage CMS": "SMT Assembly",
  "Type de carte": "Board Type",
  "Nombre de couches": "Layers",
  "Quantité": "Quantity",
  "Dimensions (L × l)": "Dimensions",
  "Matériau de base": "Material",
  "Finition de surface": "Surface Finish",
  "Prix estimé": "Est. Price",
  "Calculer le tarif direct usine": "Quote Now",
  "Devis immédiat": "Quote Now",
  "Glissez ou parcourez votre archive Gerber (.zip, .rar)":
    "Drop or browse your Gerber zip file",
  "100% testé électriquement": "100% E-Tested",
  "Délai express 24h": "24H Turnaround",
  "Revue DFM gratuite": "Free DFM Review",
  "Usine directe": "Direct Factory",
  "Devis instantané": "Instant Quote",
  "Lancer le devis instantané": "Launch Instant Quote",
  "Devis sur mesure instantané": "Instant Custom Quote",
  "Panier d'achat": "Shopping Cart",
  "USINE DIRECTE": "DIRECT FACTORY",
  "Sélectionnez le pays": "Select Country",
  "Sélectionner le pays / la langue": "Select Country / Language",
  "Accueil": "Home",
  "À propos de FT PCB": "About FT PCB",
  "Fabrication PCB": "PCB Manufacture",
  "Assemblage PCB": "PCB Assembly",
  "Produits": "Products",
  "Services à valeur ajoutée": "Value Add Service",
  "Contact": "Contact",
  "Fret aérien assuré à 100%": "100% Insured Air Transit",
  "Note matérielle vérifiée": "Verified Hardware Score",
  "Livraison mondiale ponctuelle": "On-Time Global Delivery",
  "Rendement électrique de premier passage": "Electrical First-Pass Yield",
  "Garantie aux normes industrielles": "Industry Standard Guarantee",
  "Démarrer le devis instantané": "Start Instant PCB Quote",
  "Contactez-nous": "Contact Us",
};

Object.entries(explicitFrenchMap).forEach(([fr, en]) => {
  reverseMap.set(fr.trim(), en.trim());
  lowerReverseMap.set(fr.trim().toLowerCase(), en.trim());
});

/**
 * Returns the exact English original text for any foreign text, or null if not found.
 */
export function getEnglishOriginal(text: string): string | null {
  if (!text) return null;
  const trimmed = text.trim();
  if (reverseMap.has(trimmed)) {
    return reverseMap.get(trimmed)!;
  }
  const lower = trimmed.toLowerCase();
  if (lowerReverseMap.has(lower)) {
    return lowerReverseMap.get(lower)!;
  }
  return null;
}

/**
 * Checks whether a given string is known foreign translated text.
 */
export function isForeignText(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return reverseMap.has(trimmed) || lowerReverseMap.has(trimmed.toLowerCase());
}
