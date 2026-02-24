// Slide deck specification — passed as JSON to create-slides.ts and preview-html.ts

export interface SlideDeck {
  title: string;
  theme: ThemeName | CustomTheme;
  language: "th" | "en" | "mixed";
  font?: string; // default: "Prompt"
  slides: SlideSpec[];
}

export type ThemeName = "ndf" | "dark" | "light";

export interface CustomTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface RGBColor {
  red: number;   // 0-1
  green: number;
  blue: number;
}

export interface ResolvedTheme {
  primary: RGBColor;
  secondary: RGBColor;
  accent: RGBColor;
  background: RGBColor;
  text: RGBColor;
  muted: RGBColor;
}

export type SlideSpec =
  | TitleSlide
  | ContentSlide
  | TwoColumnSlide
  | ImageTextSlide
  | BlankSlide;

export interface TitleSlide {
  layout: "title";
  title: string;
  subtitle?: string;
  icon?: string;
}

export interface ContentSlide {
  layout: "content";
  title: string;
  bullets: BulletItem[];
  icon?: string;
  notes?: string;
}

export interface BulletItem {
  text: string;
  icon?: string;
  sub?: string[];
}

export interface TwoColumnSlide {
  layout: "two-column";
  title: string;
  left: ColumnContent;
  right: ColumnContent;
  notes?: string;
}

export interface ColumnContent {
  heading?: string;
  bullets: BulletItem[];
  icon?: string;
}

export interface ImageTextSlide {
  layout: "image-text";
  title: string;
  imageUrl: string;
  imagePosition: "left" | "right";
  text: string;
  bullets?: BulletItem[];
  notes?: string;
}

export interface BlankSlide {
  layout: "blank";
  content?: string;
  backgroundColor?: string;
  notes?: string;
}
