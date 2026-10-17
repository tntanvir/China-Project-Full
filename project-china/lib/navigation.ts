import { sourceDictionary } from "@/lib/i18n";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getNavPageHref(sectionTitle: string, pageTitle: string) {
  return `/${slugify(sectionTitle)}/${slugify(pageTitle)}`;
}

export function getNavSectionHref(sectionTitle: string) {
  return `/${slugify(sectionTitle)}`;
}

export function getNavSectionBySlug(sectionSlug: string) {
  const section = sourceDictionary.navbar.navItems.find(
    (item) => slugify(item.title) === sectionSlug,
  );

  if (!section) {
    return null;
  }

  return {
    sectionTitle: section.title,
  };
}

export function getNavSectionParams() {
  return sourceDictionary.navbar.navItems.map((section) => ({
    section: slugify(section.title),
  }));
}

export function getNavPageBySlug(sectionSlug: string, pageSlug: string) {
  for (const section of sourceDictionary.navbar.navItems) {
    const matchedSection = slugify(section.title) === sectionSlug;

    if (!matchedSection) {
      continue;
    }

    const page = section.items.find((item) => slugify(item) === pageSlug);

    if (page) {
      return {
        sectionTitle: section.title,
        pageTitle: page,
      };
    }
  }

  return null;
}

export function getNavPageParams() {
  return sourceDictionary.navbar.navItems.flatMap((section) =>
    section.items.map((page) => ({
      section: slugify(section.title),
      page: slugify(page),
    })),
  );
}
