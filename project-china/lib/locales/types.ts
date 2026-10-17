import type { Dictionary } from "../i18n";

export type PartialDictionaryObject<T> = {
  [Key in keyof T]?: T[Key] extends Array<unknown>
    ? T[Key]
    : T[Key] extends object
    ? PartialDictionaryObject<T[Key]>
    : T[Key];
};

export type PartialDictionary = {
  [Key in keyof Dictionary]?: Dictionary[Key] extends Array<unknown>
    ? Dictionary[Key]
    : Dictionary[Key] extends object
    ? PartialDictionaryObject<Dictionary[Key]>
    : Dictionary[Key];
};
