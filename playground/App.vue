<template>
  <div class="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col">
    <!-- Header -->
    <header class="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
          T
        </div>
        <div>
          <h1 class="text-lg font-bold tracking-tight">ThemeKit Playground</h1>
          <p class="text-xs text-muted-foreground">Vue 3 + Tailwind CSS 动态主题展示</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <!-- System info indicator -->
        <span class="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground">
          v1.0.0
        </span>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-card/30 border-r border-border p-6 space-y-6 flex flex-col justify-between">
        <div class="space-y-6">
          <div class="space-y-2">
            <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">当前主题状态</h3>
            <div class="p-4 rounded-xl bg-card border border-border shadow-sm space-y-3">
              <div>
                <p class="text-xs text-muted-foreground">主题名称</p>
                <p class="text-sm font-bold text-primary capitalize">{{ theme }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">外观模式</p>
                <p class="text-sm font-bold text-foreground">
                  {{ isDark ? '深色模式 🌙' : '浅色模式 ☀️' }}
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">快捷切换主题</h3>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="name in ['theme', 'claude', 'twitter', 'vercel']"
                :key="name"
                @click="setTheme(name)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between border"
                :class="theme === name 
                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow-md' 
                  : 'bg-card text-foreground border-border hover:bg-muted'"
              >
                <span class="capitalize">{{ name === 'theme' ? 'Default (Theme)' : name }}</span>
                <span v-if="theme === name" class="w-1.5 h-1.5 rounded-full bg-primary-foreground"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mode Toggle -->
        <div class="pt-4 border-t border-border">
          <button
            @click="toggleDarkMode"
            class="w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition border bg-primary text-primary-foreground border-primary hover:opacity-90 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>切换 {{ isDark ? '浅色模式 ☀️' : '深色模式 🌙' }}</span>
          </button>
        </div>
      </aside>

      <!-- Main Panel -->
      <main class="flex-1 p-8 space-y-8 max-w-5xl">
        <!-- Hero section -->
        <section class="p-8 rounded-2xl bg-card border border-border shadow-md relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl"></div>
          <div class="relative z-10 space-y-4">
            <h2 class="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
              动态设计系统，瞬间换肤。
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl">
              这是采用 Vue 3 插件和 Tailwind CSS 预设构建的完整主题方案。切换左侧主题，观察页面上的配色、字体（`fontFamily`）、圆角（`borderRadius`）的平滑过渡！
            </p>
            <div class="flex flex-wrap gap-3 pt-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                🎨 字体族：<span class="font-bold font-mono">Sans-Serif</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                📐 圆角值：<span class="font-bold font-mono">var(--theme-radius)</span>
              </span>
            </div>
          </div>
        </section>

        <!-- Components grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card 1: Secondary color & Accent -->
          <div class="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-foreground">辅助色与强调色展示</h3>
            <p class="text-sm text-muted-foreground">
              卡片使用 `bg-card`，边框使用 `border-border`。下面展示了 `secondary` 和 `accent` 的色彩表现。
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-4 rounded-lg bg-secondary text-secondary-foreground border border-border">
                <p class="text-xs opacity-80">Secondary</p>
                <p class="text-sm font-bold">辅助色区域</p>
              </div>
              <div class="p-4 rounded-lg bg-accent text-accent-foreground border border-border">
                <p class="text-xs opacity-80">Accent</p>
                <p class="text-sm font-bold">强调色区域</p>
              </div>
            </div>
          </div>

          <!-- Card 2: Interactive elements -->
          <div class="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-foreground">交互按钮与状态</h3>
            <p class="text-sm text-muted-foreground">
              在不同主题下，按钮的 `primary` 和 `destructive`（破坏性/危险操作色）的视觉反馈。
            </p>
            <div class="flex flex-wrap gap-3">
              <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow hover:opacity-90 active:scale-95 transition">
                Primary 按钮
              </button>
              <button class="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium shadow hover:opacity-90 active:scale-95 transition">
                Destructive 危险
              </button>
              <button class="px-4 py-2 border border-border text-foreground hover:bg-muted rounded-lg font-medium transition">
                Border 边框按钮
              </button>
            </div>
          </div>

          <!-- Card 3: Form inputs styling -->
          <div class="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-foreground">表单表意设计</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-muted-foreground mb-1">文本输入框 (bg-input/border-border)</label>
                <input 
                  type="text" 
                  value="点击测试输入框焦点状态"
                  class="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-muted-foreground mb-1">选择器</label>
                <select class="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition">
                  <option>选项一</option>
                  <option>选项二</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Card 4: Charts mockup colors -->
          <div class="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-foreground">图表调色盘配色 (mockup)</h3>
            <p class="text-sm text-muted-foreground">内置的 `chart-1` 到 `chart-5` 的 OKLCH 色值映射效果：</p>
            <div class="flex items-center gap-2 h-10 w-full rounded-lg overflow-hidden border border-border">
              <div class="flex-1 bg-chart-1 h-full tooltip" title="Chart 1"></div>
              <div class="flex-1 bg-chart-2 h-full" title="Chart 2"></div>
              <div class="flex-1 bg-chart-3 h-full" title="Chart 3"></div>
              <div class="flex-1 bg-chart-4 h-full" title="Chart 4"></div>
              <div class="flex-1 bg-chart-5 h-full" title="Chart 5"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../src/index';

const { theme, isDark, setTheme, toggleDarkMode } = useTheme();
</script>

<style scoped>
/* 可根据需求微调 */
</style>
