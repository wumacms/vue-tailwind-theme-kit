import type { App } from 'vue';
import { createThemeState, ThemeSymbol } from './composables/useTheme';
import { defaultThemes } from './themes';
import type { PluginOptions } from './types';

export const themePlugin = {
  install(app: App, options: PluginOptions = {}) {
    // 1. 合并用户的自定义扩展主题
    if (options.extraThemes) {
      Object.assign(defaultThemes, options.extraThemes);
    }

    // 2. 创建 App 级隔离的状态
    const themeState = createThemeState(
      options.defaultTheme || 'theme',
      options.defaultDark
    );

    // 3. 提供给整棵 Vue 树使用
    app.provide(ThemeSymbol, themeState);
  }
};

export { useTheme } from './composables/useTheme';
export type { ThemeConfig, ThemeColors, PluginOptions } from './types';
