# 基于 Vue 和 TailwindCSS 的主题库设计方案 (优化版)

本项目是一个为 Vue 3 和 TailwindCSS 量身定制的**动态主题库**，支持动态切换主题色、暗色模式、系统偏好感应、SSR (服务端渲染) 安全隔离，并支持用户自定义扩展主题。

本项目采用 **Vite** 作为打包工具（库模式），使用 **TypeScript** 保证类型安全，并通过 **TailwindCSS 预设 (Preset)** 实现开箱即用。

---

## 一、 项目目录结构

完整的工程化目录结构如下：

```text
vue-tailwind-theme-kit/
├── dist/                    # 打包输出目录（自动生成）
├── src/
│   ├── composables/
│   │   └── useTheme.ts      # 核心逻辑：组合式函数（支持 SSR 隔离与系统偏好感应）
│   ├── themes/
│   │   └── index.ts         # 内置主题颜色定义
│   ├── types/
│   │   └── index.ts         # TypeScript 类型声明
│   └── index.ts             # 库入口文件（Vue 插件）
├── preset.cjs               # Tailwind CSS 预设文件（采用 CommonJS 以兼容用户 Tailwind 配置）
├── package.json             # 项目配置文件
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 打包配置
└── README.md                # 库的使用说明与防闪烁方案
```

---

## 二、 核心源码实现

### 1. `src/types/index.ts`（类型定义）

```typescript
export interface ThemeColors {
  primary: string;
  'primary-hover': string;
  background: string;
  surface: string;
  text: string;
  'text-muted': string;
}

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
```

### 2. `src/themes/index.ts`（内置颜色主题）

*注意：颜色通道值采用 `R G B` 空格分隔形式，完美契合 TailwindCSS 的透明度修饰符（如 `bg-primary/50`）。*

```typescript
import type { ThemeConfig } from '../types';

export const defaultThemes: Record<string, ThemeConfig> = {
  emerald: {
    name: 'emerald',
    light: {
      primary: '16 185 129',       // #10b981
      'primary-hover': '5 150 105', // #059669
      background: '249 250 251',   // #f9fafb
      surface: '255 255 255',      // #ffffff
      text: '17 24 39',            // #111827
      'text-muted': '107 114 128'  // #6b7280
    },
    dark: {
      primary: '52 211 153',       // #34d399
      'primary-hover': '16 185 129',
      background: '17 24 39',      // #111827
      surface: '31 41 55',         // #1f2937
      text: '249 250 251',         // #f9fafb
      'text-muted': '156 163 175'  // #9ca3af
    }
  },
  violet: {
    name: 'violet',
    light: {
      primary: '139 92 246',       // #8b5cf6
      'primary-hover': '124 58 237',
      background: '255 255 255',
      surface: '249 250 251',
      text: '15 23 42',
      'text-muted': '100 116 139'
    },
    dark: {
      primary: '167 139 250',
      'primary-hover': '139 92 246',
      background: '3 7 18',
      surface: '15 23 42',
      text: '248 250 252',
      'text-muted': '148 163 184'
    }
  }
};
```

### 3. `src/composables/useTheme.ts`（状态管理与 DOM 操作）

*优化说明：*
* **SSR 安全**：采用 Vue `inject` 获取隔离的 App 级状态，避免多请求共享全局变量污染；同时提供客户端单例兼容 SPA 场景。
* **系统偏好感应**：当本地未保存偏好时，自动读取系统的 `prefers-color-scheme`。
* **完善 API**：提供显式设置深浅色的 `setDarkMode(value)` API。

```typescript
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

export function createThemeState(defaultThemeName = 'emerald', defaultDark?: boolean): ThemeState {
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
    theme: ref('emerald'),
    isDark: ref(false),
    setTheme: () => {},
    setDarkMode: () => {},
    toggleDarkMode: () => {}
  };
}
```

### 4. `src/index.ts`（Vue 插件主入口）

```typescript
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
      options.defaultTheme || 'emerald',
      options.defaultDark
    );

    // 3. 提供给整棵 Vue 树使用
    app.provide(ThemeSymbol, themeState);
  }
};

export { useTheme } from './composables/useTheme';
export type { ThemeConfig, ThemeColors, PluginOptions } from './types';
```

### 5. `preset.cjs`（独立的 Tailwind 预设）

*优化说明：*
* 必须保存为 `.cjs` 格式。由于包的 `package.json` 设置了 `"type": "module"`，如果不使用 `.cjs` 后缀，Node.js 在处理用户的 `tailwind.config.js` 引用此预设时会因 ESM/CommonJS 格式冲突而报错。

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--theme-primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--theme-primary-hover) / <alpha-value>)",
        background: "rgb(var(--theme-background) / <alpha-value>)",
        surface: "rgb(var(--theme-surface) / <alpha-value>)",
        text: "rgb(var(--theme-text) / <alpha-value>)",
        "text-muted": "rgb(var(--theme-text-muted) / <alpha-value>)",
      },
    },
  },
};
```

---

## 三、 构建与打包配置

### 1. `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ["src"] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueTailwindThemeKit",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
```

### 2. `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"]
}
```

### 3. `package.json`

*优化说明：将 `./preset` 导出项指向 `preset.cjs`，并将其添加到 files 列表中。*

```json
{
  "name": "vue-tailwind-theme-kit",
  "version": "1.0.0",
  "description": "A dynamic theme library for Vue 3 and TailwindCSS",
  "type": "module",
  "main": "./dist/index.umd.js",
  "module": "./dist/index.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.es.js",
      "require": "./dist/index.umd.js"
    },
    "./preset": "./preset.cjs"
  },
  "files": [
    "dist",
    "preset.cjs"
  ],
  "scripts": {
    "build": "vite build"
  },
  "peerDependencies": {
    "vue": "^3.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0",
    "vue": "^3.0.0"
  }
}
```

---

## 四、 完整的包发布流程

1. **编译打包**：
   ```bash
   npm run build
   ```
2. **登录 NPM**：
   ```bash
   npm login
   ```
   *(如果使用了淘宝等第三方源，发布前需切回官方源：`npm config set registry https://registry.npmjs.org/`)*
3. **发布包**：
   ```bash
   npm publish --access public
   ```

---

## 五、 用户最终使用手册

### 1. 安装依赖

```bash
npm install vue-tailwind-theme-kit
```

### 2. 配置 Tailwind

在项目根目录的 `tailwind.config.js`（或 `tailwind.config.mjs`）中引入预设：

```javascript
import themePreset from "vue-tailwind-theme-kit/preset";

export default {
  presets: [themePreset],
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
};
```

### 3. 注册插件

在项目入口文件 `main.ts` 中注册插件：

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { themePlugin } from 'vue-tailwind-theme-kit';

const app = createApp(App);

app.use(themePlugin, {
  defaultTheme: 'emerald',
  // defaultDark: false, // 可选，不填则默认感应系统深色偏好
});

app.mount('#app');
```

### 4. 业务组件中使用

```html
<template>
  <div class="min-h-screen bg-background text-text transition-colors duration-200">
    <header class="p-4 bg-surface border-b border-text-muted/10">
      <h1 class="text-xl font-bold">主题展示</h1>
    </header>

    <main class="p-6 space-y-4">
      <div class="p-4 bg-surface rounded shadow">
        当前主题: <span class="text-primary font-semibold">{{ theme }}</span>
      </div>

      <div class="flex gap-4">
        <button 
          @click="setTheme('emerald')" 
          class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition"
        >
          切换至 翡翠绿 (Emerald)
        </button>
        
        <button 
          @click="setTheme('violet')" 
          class="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded transition"
        >
          切换至 罗兰紫 (Violet)
        </button>
        
        <button 
          @click="toggleDarkMode" 
          class="px-4 py-2 border border-text-muted rounded hover:bg-text-muted/10 transition"
        >
          切换暗色模式 (当前: {{ isDark ? '暗色' : '浅色' }})
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'vue-tailwind-theme-kit';

const { theme, isDark, setTheme, toggleDarkMode } = useTheme();
</script>
```

### 5. 防首屏闪烁 (Anti-FOUC) 最佳实践

在客户端渲染或服务端渲染应用中，为防止首屏加载时 JS 未执行完毕导致页面背景出现“白屏/黑屏闪烁”，建议在 `index.html` 的 `<head>` 中植入以下极简内联脚本：

```html
<script>
  (function() {
    try {
      const savedTheme = localStorage.getItem('ui-theme') || 'emerald';
      const savedDark = localStorage.getItem('ui-dark-mode');
      const isDark = savedDark !== null ? savedDark === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 提前应用 dark 类名
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
</script>
```
