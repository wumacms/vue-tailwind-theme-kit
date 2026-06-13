# @zeldafox/vue-tailwind-theme-kit

一个为 Vue 3 和 TailwindCSS 量身定制的**动态主题库**。支持动态切换主题色、暗色模式、系统偏好感应、SSR (服务端渲染) 安全隔离，并支持用户自定义扩展主题。

## 特性

* 🎨 **动态全套主题切换**：内置包含 `theme`（默认样式）、`claude`、`twitter`、`vercel` 以及包括 `amber_minimal`、`catppuccin`、`cyberpunk` 等在内的 40+ 套精美预设。
* 🌓 **全属性映射**：通过 Tailwind CSS 预设自动扩展 `colors`（如 `background`、`foreground`、`primary`、`secondary`、`card`、`sidebar`、`muted` 等）、`borderRadius`、`fontFamily` 变量。
* 🌓 **暗色模式切换**：支持手动切换、显式设置以及自动跟随系统偏好（`prefers-color-scheme`）。
* ⚡ **SSR 安全设计**：使用 Vue `provide` / `inject` 进行应用级状态隔离，完全规避多请求下的跨请求状态污染，对 Nuxt 3 友好。
* 📦 **现代打包格式**：支持导出 ESM 与 UMD 两种模块格式，附带完整的 TypeScript 类型声明支持。
* ✨ **防闪烁支持**：提供客户端/服务端首屏加载时防颜色闪烁 (Anti-FOUC) 最佳实践。

---

## 安装

```bash
pnpm add @zeldafox/vue-tailwind-theme-kit
# 或
npm install @zeldafox/vue-tailwind-theme-kit
```

---

## 快速上手

### 1. 引入 Tailwind CSS 预设

在项目的 `tailwind.config.js`（或 `tailwind.config.mjs`）中引入库预设：

```javascript
import themePreset from "@zeldafox/vue-tailwind-theme-kit/preset";

export default {
  presets: [themePreset],
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
};
```

### 2. 注册 Vue 插件

在项目入口文件（例如 `main.ts` 或 `main.js`）中注册：

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import { themePlugin } from '@zeldafox/vue-tailwind-theme-kit';

// 引入基础 Tailwind 样式
import './assets/main.css'; 

const app = createApp(App);

app.use(themePlugin, {
  defaultTheme: 'theme', // 默认内置主题，支持 theme、claude、twitter、vercel 等 40+ 种内置主题
  // defaultDark: false, // 是否默认启用暗色模式。若不填则自动感应系统深浅色偏好
});

app.mount('#app');
```

### 3. 在业务组件中使用

在 Vue 组件中通过 `useTheme()` 轻松控制和感应主题状态：

```html
<template>
  <div class="min-h-screen bg-background text-foreground transition-colors duration-200 font-sans">
    <div class="max-w-2xl mx-auto p-8 space-y-6">
      <div class="p-6 bg-card text-card-foreground rounded-lg border border-border shadow-md">
        <h2 class="text-2xl font-bold text-primary mb-2">动态主题展示</h2>
        <p class="text-muted-foreground">当前主题名称: <strong class="text-foreground">{{ theme }}</strong></p>
        <p class="text-muted-foreground">当前模式: <strong class="text-foreground">{{ isDark ? '深色 🌙' : '浅色 ☀️' }}</strong></p>
      </div>

      <div class="flex flex-wrap gap-4">
        <button 
          @click="setTheme('theme')"
          class="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow transition"
        >
          默认主题 (theme)
        </button>
        <button 
          @click="setTheme('claude')"
          class="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow transition"
        >
          Claude 主题
        </button>
        <button 
          @click="setTheme('twitter')"
          class="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow transition"
        >
          Twitter 主题
        </button>
        <button 
          @click="setTheme('vercel')"
          class="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow transition"
        >
          Vercel 主题
        </button>
        <button 
          @click="toggleDarkMode"
          class="px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted transition"
        >
          切换暗色模式
        </button>
        <button 
          @click="setDarkMode(true)"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition"
        >
          强行启用暗色
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@zeldafox/vue-tailwind-theme-kit';

const { theme, isDark, setTheme, setDarkMode, toggleDarkMode } = useTheme();
</script>
```

---

## 进阶配置与自定义主题

你可以在插件初始化时，通过 `extraThemes` 选项传入自定义的主题配置（颜色格式推荐与 CSS 规范相符，例如 `oklch(...)`、`hsl(...)` 或 `rgb(...)`，它们可直接适配预设配置下的透明度感知）：

```typescript
import { themePlugin } from '@zeldafox/vue-tailwind-theme-kit';

app.use(themePlugin, {
  defaultTheme: 'sunset',
  extraThemes: {
    sunset: {
      name: 'sunset',
      light: {
        background: 'oklch(0.98 0.02 80)',
        foreground: 'oklch(0.15 0.05 40)',
        card: 'oklch(1 0 0)',
        'card-foreground': 'oklch(0.15 0.05 40)',
        popover: 'oklch(1 0 0)',
        'popover-foreground': 'oklch(0.15 0.05 40)',
        primary: 'oklch(0.65 0.22 45)', // 亮橘色
        'primary-foreground': 'oklch(0.99 0.01 90)',
        secondary: 'oklch(0.95 0.02 80)',
        'secondary-foreground': 'oklch(0.15 0.05 40)',
        muted: 'oklch(0.95 0.02 80)',
        'muted-foreground': 'oklch(0.45 0.05 40)',
        accent: 'oklch(0.95 0.02 80)',
        'accent-foreground': 'oklch(0.15 0.05 40)',
        destructive: 'oklch(0.57 0.23 27)',
        'destructive-foreground': 'oklch(1 0 0)',
        border: 'oklch(0.92 0.02 80)',
        input: 'oklch(0.92 0.02 80)',
        ring: 'oklch(0.65 0.22 45)',
        radius: '0.5rem',
        'font-sans': 'sans-serif'
      },
      dark: {
        background: 'oklch(0.15 0.05 40)',
        foreground: 'oklch(0.98 0.02 80)',
        card: 'oklch(0.18 0.04 40)',
        'card-foreground': 'oklch(0.98 0.02 80)',
        popover: 'oklch(0.18 0.04 40)',
        'popover-foreground': 'oklch(0.98 0.02 80)',
        primary: 'oklch(0.70 0.20 45)',
        'primary-foreground': 'oklch(0.15 0.05 40)',
        secondary: 'oklch(0.22 0.04 40)',
        'secondary-foreground': 'oklch(0.98 0.02 80)',
        muted: 'oklch(0.22 0.04 40)',
        'muted-foreground': 'oklch(0.75 0.02 80)',
        accent: 'oklch(0.22 0.04 40)',
        'accent-foreground': 'oklch(0.98 0.02 80)',
        destructive: 'oklch(0.57 0.23 27)',
        'destructive-foreground': 'oklch(1 0 0)',
        border: 'oklch(0.25 0.04 40)',
        input: 'oklch(0.25 0.04 40)',
        ring: 'oklch(0.70 0.20 45)',
        radius: '0.5rem',
        'font-sans': 'sans-serif'
      }
    }
  }
});
```

---

## 最佳实践：防止首屏闪烁 (Anti-FOUC)

由于 CSS 变量的挂载和暗色类名触发依赖于 JavaScript 执行，在首屏加载时，页面可能会短暂地显露浅色背景。

为了保证极致的视觉体验，建议在项目的 `index.html` 模板 `<head>` 中植入以下极简内联脚本。这段脚本优先执行且不依赖任何框架包，可以实现无缝的暗色模式首屏加载：

```html
<script>
  (function() {
    try {
      const savedTheme = localStorage.getItem('ui-theme') || 'theme';
      const savedDark = localStorage.getItem('ui-dark-mode');
      const isDark = savedDark !== null ? savedDark === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // 提前注入 dark 类名防闪烁
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
</script>
```

---

## 开发、构建与发布

### 1. 本地开发与构建

1. 安装依赖：
   ```bash
   pnpm install
   ```
2. 运行本地开发与预览服务器：
   ```bash
   pnpm dev
   ```
3. 执行编译：
   ```bash
   pnpm build
   ```
   该指令将使用 Vite 打包并将包编译生成到 `dist/` 文件夹下，包含 `index.es.js`, `index.umd.js` 以及 TypeScript 定义文件 `index.d.ts`。

---

### 2. 发布到 NPM

#### 方案 A：普通账户密码/OTP 验证发布

1. **配置官方源**：确保本地使用的是 NPM 官方源（避免使用淘宝等镜像源）：
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```
2. **登录 NPM 账号**：
   ```bash
   npm login
   ```
3. **发布公开 Scoped 包**：
   ```bash
   npm publish --access public
   ```
   *(如果账户配置了 2FA，终端会提示输入一次性验证码 OTP，或者可以通过 `--otp=xxxxxx` 参数直接传入验证码。)*

#### 方案 B：使用安全密钥 (Security Key / 2FA) 的发布方案（推荐）

如果你的账户开启了物理安全密钥（如 Touch ID、YubiKey 等 2FA 且无数字验证码），在终端直接发布可能会被拒绝。此时应通过 **颗粒度访问令牌 (Granular Access Token)** 来完成发布：

1. **生成 Token**：
   * 浏览器登录 [npmjs.com](https://www.npmjs.com/)，进入 **Access Tokens** -> **Generate New Token** -> **Granular Access Token**。
   * 配置权限为 **Read and Write**，并选择适用于该包的作用域，接着勾选 **"Bypass two-factor authentication (2FA)"** 选项。
   * 复制生成的 Token (形如 `npm_...`)。
2. **本地配置与发布**：
   * 在项目根目录下创建临时 `.npmrc` 文件：
     ```text
     //registry.npmjs.org/:_authToken=你的_NPM_TOKEN
     ```
   * 运行发布命令：
     ```bash
     npm publish --access public
     ```
   * **安全提示**：发布成功后，请立即**删除**根目录下的 `.npmrc` 文件以防 Token 泄露。

---

## 授权许可

[MIT License](LICENSE)
