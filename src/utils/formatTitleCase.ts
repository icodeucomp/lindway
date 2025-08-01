export const formatTitleCase = (str: string) => {
  if (!str) return "";

  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const _formatTitleCase = (str: string) => {
  if (!str) return "";

  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
