import type { Locale } from "@/lib/i18n";

type DictionaryValue =
  | string
  | number
  | boolean
  | null
  | DictionaryValue[]
  | { [key: string]: DictionaryValue };

export type TranslationPayload = Record<string, DictionaryValue>;

type FlattenedText = {
  path: string;
  text: string;
};

function isPlainObject(value: DictionaryValue): value is Record<string, DictionaryValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function flattenTexts(
  value: DictionaryValue,
  path = "",
  output: FlattenedText[] = [],
) {
  if (typeof value === "string") {
    output.push({ path, text: value });
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flattenTexts(item, path ? `${path}.${index}` : String(index), output);
    });
    return output;
  }

  if (isPlainObject(value)) {
    Object.entries(value).forEach(([key, item]) => {
      flattenTexts(item, path ? `${path}.${key}` : key, output);
    });
  }

  return output;
}

export function applyTranslations<T extends TranslationPayload>(
  source: T,
  translations: Record<string, string>,
) {
  const clone = structuredClone(source);

  Object.entries(translations).forEach(([path, translatedText]) => {
    const keys = path.split(".");
    let cursor: unknown = clone;

    keys.slice(0, -1).forEach((key) => {
      if (Array.isArray(cursor)) {
        cursor = cursor[Number(key)];
        return;
      }

      if (cursor && typeof cursor === "object") {
        cursor = (cursor as Record<string, unknown>)[key];
      }
    });

    const lastKey = keys.at(-1);

    if (!lastKey) {
      return;
    }

    if (Array.isArray(cursor)) {
      cursor[Number(lastKey)] = translatedText;
      return;
    }

    if (cursor && typeof cursor === "object") {
      (cursor as Record<string, unknown>)[lastKey] = translatedText;
    }
  });

  return clone;
}

export function getTranslationCacheKey(locale: Locale) {
  return `dynamic-translations:v2:${locale}`;
}

export async function translatePayload<T extends TranslationPayload>(
  payload: T,
  _targetLocale: Locale,
  _signal?: AbortSignal,
) {
  return payload;
}
