export type ThemeColors = Record<string, string>;

export interface ThemeConfig {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface PluginOptions {
  defaultTheme?: string;
  defaultDark?: boolean;
  extraThemes?: Record<string, ThemeConfig>;
}
