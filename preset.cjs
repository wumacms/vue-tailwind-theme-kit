/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--theme-background)",
        foreground: "var(--theme-foreground)",
        card: {
          DEFAULT: "var(--theme-card)",
          foreground: "var(--theme-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--theme-popover)",
          foreground: "var(--theme-popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--theme-primary)",
          foreground: "var(--theme-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--theme-secondary)",
          foreground: "var(--theme-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--theme-muted)",
          foreground: "var(--theme-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--theme-accent)",
          foreground: "var(--theme-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--theme-destructive)",
          foreground: "var(--theme-destructive-foreground)",
        },
        border: "var(--theme-border)",
        input: "var(--theme-input)",
        ring: "var(--theme-ring)",
        chart: {
          1: "var(--theme-chart-1)",
          2: "var(--theme-chart-2)",
          3: "var(--theme-chart-3)",
          4: "var(--theme-chart-4)",
          5: "var(--theme-chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--theme-sidebar)",
          foreground: "var(--theme-sidebar-foreground)",
          primary: "var(--theme-sidebar-primary)",
          "primary-foreground": "var(--theme-sidebar-primary-foreground)",
          accent: "var(--theme-sidebar-accent)",
          "accent-foreground": "var(--theme-sidebar-accent-foreground)",
          border: "var(--theme-sidebar-border)",
          ring: "var(--theme-sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--theme-radius)",
        md: "calc(var(--theme-radius) - 2px)",
        sm: "calc(var(--theme-radius) - 4px)",
      },
      fontFamily: {
        sans: "var(--theme-font-sans)",
        serif: "var(--theme-font-serif)",
        mono: "var(--theme-font-mono)",
      },
    },
  },
};
