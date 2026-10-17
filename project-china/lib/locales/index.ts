import type { Locale } from "../i18n";
import type { PartialDictionary } from "./types";
import { zhLocale } from "./zh";
import { bnLocale } from "./bn";
import { deLocale } from "./de";
import { jaLocale } from "./ja";
import { koLocale } from "./ko";
import { hiLocale } from "./hi";
import { urLocale } from "./ur";
import { frLocale } from "./fr";
import { itLocale } from "./it";
import { esLocale } from "./es";
import { ruLocale } from "./ru";
import { ptLocale } from "./pt";
import { arLocale } from "./ar";
import { trLocale } from "./tr";
import { afLocale } from "./af";

export const localeOverrides: Record<Exclude<Locale, "en">, PartialDictionary> = {
  zh: zhLocale,
  bn: bnLocale,
  de: deLocale,
  ja: jaLocale,
  ko: koLocale,
  hi: hiLocale,
  ur: urLocale,
  fr: frLocale,
  it: itLocale,
  es: esLocale,
  ru: ruLocale,
  pt: ptLocale,
  ar: arLocale,
  tr: trLocale,
  af: afLocale,
};

export { localizedNavItems } from "./nav-items";
export type { PartialDictionary, PartialDictionaryObject } from "./types";
