// Universal Icon Loader for 100% coverage across languages
// Priority: SimpleIcons → Devicon → PL-Logos → Local → null

/**
 * Normalizes GitHub language names to predictable slugs.
 */
export function normalizeLangName(lang: string) {
  return lang
    .toLowerCase()
    .replace(/\+/g, "plus")      // C++ -> cplusplus (handled below)
    .replace(/#/g, "sharp")      // C# -> csharp
    .replace(/\s+/g, "").toLocaleLowerCase()
    .trim();
}

/**
 * Special slugs for SimpleIcons and Devicon inconsistencies.
 */
export function resolveSpecialSlug(lang: string) {
  const key = lang.toLowerCase().trim();

  const map: Record<string, string> = {
    "Dockerfile": "docker",
    "dockerfile": "docker",
    "c++": "cplusplus",
    "cplusplus": "cplusplus",
    "c#": "csharp",
    "csharp": "csharp",
    "shell": "bash",
    "bash": "bash",
    "sh": "bash",
    "batchfile": "batch",
    "makefile": "makefile",
    "html": "html5",
    "css": "css3",
    "java": "java", 
  };
  return map[key] || key;
}


/**
 * Builds the URL for local rare icons.
 */
export function rareIconUrl(slug: string) {
    return `/icons/rare/${slug}.svg`;
}

/**
 * Builds the URL for SimpleIcons.
 */
export function simpleIconsUrl(slug: string) {
    return `https://cdn.simpleicons.org/${slug}`;
}

/**
 * Try Devicon (most popular programming icon set)
 */
export function deviconUrl(slug: string) {
    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${slug}/${slug}-original.svg`;
}

/**
 * Try Programming-Language-Logos (covers rare languages)
 */
export function plLogosUrl(slug: string) {
    return `https://raw.githubusercontent.com/abranhe/programming-languages-logos/master/src/${slug}/${slug}.svg`;
}

/**
 * Try local fallback
 */
export function localIconUrl(slug: string) {
    return `/icons/${slug}.svg`;
}

/**
 * Universal icon loader: returns an array of URLs to try in sequence.
 */
export function getLanguageIconUrl(lang: string) {
    const normalized = normalizeLangName(lang);
    const slug = resolveSpecialSlug(normalized);
    return [
        deviconUrl(slug),
        plLogosUrl(slug),
        localIconUrl(slug),
        rareIconUrl(slug),
        simpleIconsUrl(slug),
        null,
        ];
}
