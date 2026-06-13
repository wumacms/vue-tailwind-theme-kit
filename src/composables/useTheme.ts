import { ref, inject, readonly, type InjectionKey, type Ref } from 'vue';
import { defaultThemes } from '../themes';

export interface ThemeState {
  theme: Ref<string>;
  isDark: Ref<boolean>;
  setTheme: (themeName: string) => void;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

export const ThemeSymbol: InjectionKey<ThemeState> = Symbol('ThemeState');

let clientInstance: ThemeState | null = null;

export function createThemeState(defaultThemeName = 'theme', defaultDark?: boolean): ThemeState {
  const theme = ref<string>(defaultThemeName);
  const isDark = ref<boolean>(defaultDark ?? false);

  const updateThemeDOM = () => {
    if (typeof window === 'undefined') return;
    
    const themeData = defaultThemes[theme.value];
    if (!themeData) return;

    const colors = isDark.value ? themeData.dark : themeData.light;
    const root = document.documentElement;

    // 1. 动态注入 CSS 变量
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // 2. 控制 html 上的 dark 类名（配合 Tailwind CSS 暗色模式）
    if (isDark.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 3. 持久化存储
    localStorage.setItem('ui-theme', theme.value);
    localStorage.setItem('ui-dark-mode', String(isDark.value));
  };

  const setTheme = (themeName: string) => {
    if (!defaultThemes[themeName]) {
      console.warn(`[theme-kit] Theme "${themeName}" does not exist.`);
      return;
    }
    theme.value = themeName;
    updateThemeDOM();
  };

  const setDarkMode = (value: boolean) => {
    isDark.value = value;
    updateThemeDOM();
  };

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    updateThemeDOM();
  };

  // 仅在客户端执行的初始化逻辑
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('ui-theme');
    const savedDark = localStorage.getItem('ui-dark-mode');

    if (savedTheme && defaultThemes[savedTheme]) {
      theme.value = savedTheme;
    }

    if (savedDark !== null) {
      isDark.value = savedDark === 'true';
    } else if (defaultDark === undefined) {
      // 自动读取系统深色模式偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    updateThemeDOM();
  }

  return {
    theme,
    isDark,
    setTheme,
    setDarkMode,
    toggleDarkMode
  };
}

export function useTheme(): ThemeState {
  // 1. 优先使用 Vue provide/inject 的状态（支持 SSR 隔离）
  const state = inject(ThemeSymbol, null);
  if (state) {
    return state;
  }

  // 2. 客户端单例（SPA 或直接调用 useTheme 降级使用）
  if (typeof window !== 'undefined') {
    if (!clientInstance) {
      clientInstance = createThemeState();
    }
    return clientInstance;
  }

  // 3. 服务端安全兜底
  return {
    theme: ref('theme'),
    isDark: ref(false),
    setTheme: () => {},
    setDarkMode: () => {},
    toggleDarkMode: () => {}
  };
}
