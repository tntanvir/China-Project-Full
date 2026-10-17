"use client";

import { useEffect, useRef } from "react";
import { countryGoogleLangMap, CountryCode } from "@/lib/i18n";
import { useLanguage } from "./language-provider";
import { fullPagePhrases, SupportedLocale } from "@/lib/translation-dictionary";
import { getEnglishOriginal } from "@/lib/reverse-dictionary";

/**
 * Aggressively sets or clears the Google Translate cookie (`googtrans`).
 * When target language is English, it clears all domain/path permutations of `googtrans`
 * and explicitly sets `googtrans=/en/en` to prevent Google Chrome or external scripts
 * from sticking to a previously selected language like French (`/en/fr`).
 */
export function setGoogleTranslateCookie(countryCode: CountryCode) {
  if (typeof document === "undefined") return;

  const targetLang = countryGoogleLangMap[countryCode] || "en";
  const hostname = window.location.hostname;

  const domains = [
    "",
    hostname,
    `.${hostname}`,
    "localhost",
    ".localhost",
  ];
  if (hostname.includes(".")) {
    const parentDomain = hostname.replace(/^www\./, "");
    domains.push(parentDomain, `.${parentDomain}`);
  }

  const paths = ["/", "", window.location.pathname];
  const cookieNames = ["googtrans", "__googtrans", "googtrans_ext"];

  // Thoroughly delete existing googtrans cookies across all variations
  cookieNames.forEach((name) => {
    paths.forEach((path) => {
      domains.forEach((domain) => {
        const domainAttr = domain ? `; domain=${domain}` : "";
        const pathAttr = path ? `; path=${path}` : "";
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0${pathAttr}${domainAttr};`;
      });
    });
  });

  if (targetLang === "en") {
    // Explicitly set /en/en so Google Translate engine stays in English
    document.cookie = "googtrans=/en/en; path=/; max-age=31536000;";
    if (hostname && hostname !== "localhost") {
      document.cookie = `googtrans=/en/en; domain=${hostname}; path=/; max-age=31536000;`;
    }

    // Clean up any injected Google Translate DOM elements or styles
    try {
      document.querySelectorAll(".goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame").forEach((el) => {
        el.remove();
      });
      if (document.body.style.top) {
        document.body.style.top = "";
      }
      if (document.body.style.position === "relative") {
        document.body.style.position = "";
      }
      document.documentElement.classList.remove("translated-ltr", "translated-rtl");
      document.body.classList.remove("translated-ltr", "translated-rtl");
    } catch {
      // DOM cleanup safe guard
    }
  } else {
    // Set cookie for foreign target language
    document.cookie = `googtrans=/en/${targetLang}; path=/; max-age=31536000;`;
    if (hostname && hostname !== "localhost") {
      document.cookie = `googtrans=/en/${targetLang}; domain=${hostname}; path=/; max-age=31536000;`;
    }
  }
}

// WeakMap to store canonical English original text for text nodes to prevent corruption
const originalTextMap = new WeakMap<Node, string>();

/**
 * Restores a text node to its canonical English text.
 * Checks reverse translation dictionary first, then WeakMap storage.
 */
function restoreToEnglish(node: Text) {
  const currentText = node.textContent;
  if (!currentText) return;

  const trimmed = currentText.trim();
  if (!trimmed || trimmed.length < 2) return;

  // 1. Check if the current text is a known foreign translation (e.g. French, Chinese, German)
  const englishDirect = getEnglishOriginal(trimmed);
  if (englishDirect) {
    const leadingWs = currentText.match(/^\s*/)?.[0] || "";
    const trailingWs = currentText.match(/\s*$/)?.[0] || "";
    node.textContent = leadingWs + englishDirect + trailingWs;
    originalTextMap.set(node, englishDirect);
    return;
  }

  // 2. Check if a clean English original was cached in WeakMap
  const orig = originalTextMap.get(node);
  if (orig) {
    const trueEnglish = getEnglishOriginal(orig) || orig;
    if (trimmed !== trueEnglish) {
      const leadingWs = currentText.match(/^\s*/)?.[0] || "";
      const trailingWs = currentText.match(/\s*$/)?.[0] || "";
      node.textContent = leadingWs + trueEnglish + trailingWs;
    }
    return;
  }

  // 3. Current text is already English; cache it as canonical original
  originalTextMap.set(node, trimmed);
}

/**
 * Translates a text node to the target foreign locale.
 */
function translateToLocale(node: Text, locale: SupportedLocale) {
  const currentText = node.textContent;
  if (!currentText) return;

  const trimmed = currentText.trim();
  if (!trimmed || trimmed.length < 2) return;

  // Ensure original text is pure English before translating
  let orig = originalTextMap.get(node);
  if (!orig) {
    orig = getEnglishOriginal(trimmed) || trimmed;
    originalTextMap.set(node, orig);
  } else {
    const cleanOrig = getEnglishOriginal(orig);
    if (cleanOrig) {
      orig = cleanOrig;
      originalTextMap.set(node, orig);
    }
  }

  const translations = fullPagePhrases[orig];
  if (translations && translations[locale]) {
    const replacement = translations[locale]!;
    const leadingWs = currentText.match(/^\s*/)?.[0] || "";
    const trailingWs = currentText.match(/\s*$/)?.[0] || "";
    node.textContent = leadingWs + replacement + trailingWs;
  }
}

function walkDOM(root: Node, locale: string) {
  if (!root) return;

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(n) {
        const parent = n.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toUpperCase();
        if (
          tag === "SCRIPT" ||
          tag === "STYLE" ||
          tag === "CODE" ||
          tag === "PRE" ||
          tag === "SVG" ||
          tag === "CANVAS" ||
          tag === "NOSCRIPT"
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) {
      if (locale === "en") {
        restoreToEnglish(current as Text);
      } else {
        translateToLocale(current as Text, locale as SupportedLocale);
      }
    }
    current = walker.nextNode();
  }
}

/**
 * Universal Full-Page Localization & Dynamic Translation Engine
 * 1. Synchronizes document.lang & document.dir (RTL support for Arabic and Urdu)
 * 2. Applies googtrans cookie cleanly across all domains & paths
 * 3. Bidirectionally translates full DOM text nodes without residual French or foreign leakage
 * 4. Maintains an active MutationObserver to ensure incoming nodes adhere to the selected language
 */
export function GoogleTranslateBridge() {
  const { selectedCountry, locale } = useLanguage();
  const observerRef = useRef<MutationObserver | null>(null);
  const isInitialMount = useRef(true);
  const prevLocaleRef = useRef(locale);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Sync document metadata
    document.documentElement.lang = selectedCountry.locale;
    document.documentElement.dir =
      selectedCountry.locale === "ar" || selectedCountry.locale === "ur" ? "rtl" : "ltr";

    // 2. Sync Google Translate cookie cleanly
    setGoogleTranslateCookie(selectedCountry.countryCode);

    // 3. Process existing document DOM
    // CRITICAL: On initial mount with English, the SSR HTML is already 100% English.
    // Do NOT walk and mutate DOM nodes during initial hydration to prevent React hydration mismatch.
    const isEnglishInitial = isInitialMount.current && selectedCountry.locale === "en";
    const switchedToEnglish = prevLocaleRef.current !== "en" && selectedCountry.locale === "en";

    if (!isEnglishInitial || switchedToEnglish || selectedCountry.locale !== "en") {
      walkDOM(document.body, selectedCountry.locale);
    }

    isInitialMount.current = false;
    prevLocaleRef.current = selectedCountry.locale;

    // 4. Set up MutationObserver
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Only observe when in a foreign locale
    if (selectedCountry.locale !== "en") {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              walkDOM(node, selectedCountry.locale);
            });
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectedCountry, locale]);

  return null;
}
