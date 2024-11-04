export const formatForUrl = (category: string) => {
  return category
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, "-");
};

export const formatForCategory = (category: string): string => {
  return category
    .replace(/[-,–—/\\:;!?.()'"]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\d+/g, "");
};

export const decodeURIComponentCleaned = (url: string): string => {
  return decodeURIComponent(url).replace(/%2c/g, "");
};