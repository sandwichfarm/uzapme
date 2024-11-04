export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char: string) => char + char)
      .join("");
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

export type RGB = { r: number, g: number, b: number }

export const getBrightness = (rgb: RGB) => {
  const { r, g, b } = rgb;
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getContrastingTextColor = (hex: string): string => {
  const rgb = hexToRgb(hex);
  const brightness = getBrightness(rgb);
  return brightness < 128 ? "#fff" : "#000";
};
