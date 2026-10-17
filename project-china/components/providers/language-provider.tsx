"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  countryOptions,
  defaultLocale,
  getDictionary,
  sourceDictionary,
  type CountryOption,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

import {
  GoogleTranslateBridge,
  setGoogleTranslateCookie,
} from "./GoogleTranslateBridge";

type TranslationStatus = "idle" | "ready";

type LanguageContextValue = {
  locale: Locale;
  selectedCountry: CountryOption;
  countryOptions: CountryOption[];
  setSelectedCountry: (country: CountryOption) => void;
  translationStatus: TranslationStatus;
};

const STORAGE_KEY = "site-country-language";

const defaultCountry =
  countryOptions.find((country) => country.locale === defaultLocale) ??
  countryOptions[0];
const LanguageContext = createContext<LanguageContextValue | null>(null);
const DictionaryContext = createContext<Dictionary>(sourceDictionary);

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" || locale === "ur" ? "rtl" : "ltr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always initialize with defaultCountry for identical SSR and initial client hydration
  const [selectedCountryCode, setSelectedCountryCode] =
    useState<CountryOption["countryCode"]>(defaultCountry.countryCode);
  const translationStatus: TranslationStatus = "ready";

  const selectedCountry = useMemo(() => {
    return (
      countryOptions.find(
        (country) => country.countryCode === selectedCountryCode,
      ) ?? defaultCountry
    );
  }, [selectedCountryCode]);

  const dictionary = useMemo(
    () => getDictionary(selectedCountry.locale),
    [selectedCountry.locale],
  );

  // Sync from localStorage after client hydration is complete
  useEffect(() => {
    try {
      const storedCountryCode = window.localStorage.getItem(STORAGE_KEY);
      if (storedCountryCode) {
        const found = countryOptions.find((c) => c.countryCode === storedCountryCode);
        if (found) {
          setSelectedCountryCode(found.countryCode);
          applyDocumentLocale(found.locale);
          setGoogleTranslateCookie(found.countryCode);
          return;
        }
      }
      // If default or first time, enforce clean English state and cookie
      applyDocumentLocale(defaultCountry.locale);
      setGoogleTranslateCookie(defaultCountry.countryCode);
    } catch {
      // Storage safe guard
    }
  }, []);

  const setSelectedCountry = useCallback((country: CountryOption) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, country.countryCode);
    } catch {
      // Storage safe guard
    }
    setGoogleTranslateCookie(country.countryCode);
    applyDocumentLocale(country.locale);
    setSelectedCountryCode(country.countryCode);
  }, []);

  const value = useMemo(
    () => ({
      locale: selectedCountry.locale,
      selectedCountry,
      countryOptions,
      setSelectedCountry,
      translationStatus,
    }),
    [selectedCountry, setSelectedCountry, translationStatus],
  );

  return (
    <LanguageContext.Provider value={value}>
      <DictionaryContext.Provider value={dictionary}>
        <GoogleTranslateBridge />
        {children}
      </DictionaryContext.Provider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}

export function useDictionary() {
  return useContext(DictionaryContext);
}
