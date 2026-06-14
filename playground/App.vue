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
          v1.1.0
        </span>
        <!-- Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center shadow-sm"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
        >
          <Sun v-if="isDark" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-card/30 border-r border-border p-6 space-y-6 flex flex-col">
        <div class="space-y-6">
          <div class="space-y-2">
            <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">当前主题状态</h3>
            <div class="p-4 rounded-xl bg-card border border-border shadow-sm space-y-3">
              <div>
                <p class="text-xs text-muted-foreground mb-1.5">主题名称</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm capitalize">
                  {{ theme.replace(/_/g, ' ') }}
                </span>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">外观模式</p>
                <div class="flex items-center gap-2 mt-1">
                  <Moon v-if="isDark" class="w-4 h-4 text-foreground" />
                  <Sun v-else class="w-4 h-4 text-foreground" />
                  <span class="text-sm font-bold text-foreground">
                    {{ isDark ? '深色模式' : '浅色模式' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2 relative" ref="dropdownRef">
            <h3 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">选择内置主题</h3>
            
            <!-- Custom Dropdown Trigger -->
            <button
              type="button"
              @click="toggleDropdown"
              class="w-full px-3 py-2 bg-input hover:bg-input/80 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 capitalize font-semibold shadow-sm flex items-center justify-between gap-2"
            >
              <div class="flex items-center gap-3 truncate">
                <!-- Color dots stack on the left -->
                <div class="flex items-center -space-x-1.5 overflow-hidden flex-shrink-0">
                  <div 
                    class="w-3.5 h-3.5 rounded-full border border-foreground/20 shadow-sm transition-colors duration-300"
                    :style="{ backgroundColor: getThemeColor(activeTheme, 'primary') }"
                    title="Primary"
                  ></div>
                  <div 
                    class="w-3.5 h-3.5 rounded-full border border-foreground/20 shadow-sm transition-colors duration-300"
                    :style="{ backgroundColor: getThemeColor(activeTheme, 'secondary') }"
                    title="Secondary"
                  ></div>
                  <div 
                    class="w-3.5 h-3.5 rounded-full border border-foreground/20 shadow-sm transition-colors duration-300"
                    :style="{ backgroundColor: getThemeColor(activeTheme, 'accent') }"
                    title="Accent"
                  ></div>
                </div>
                <span class="truncate">{{ activeTheme === 'theme' ? 'Default (Theme)' : activeTheme.replace(/_/g, ' ') }}</span>
              </div>
              
              <!-- Chevron Icon -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                class="w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0"
                :class="{ 'rotate-180': isOpen }"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Popover Panel -->
            <div
              v-show="isOpen"
              class="absolute z-[100] left-0 right-0 mt-1.5 bg-popover/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-150 origin-top"
            >
              <!-- Search Bar -->
              <div class="p-2 border-b border-border flex items-center gap-1.5 bg-muted/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-muted-foreground flex-shrink-0 ml-1.5">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="搜索主题..."
                  class="w-full bg-transparent text-xs py-1.5 px-1 text-popover-foreground focus:outline-none placeholder:text-muted-foreground font-medium"
                  @keydown.esc="isOpen = false"
                />
              </div>

              <!-- Theme List -->
              <div class="overflow-y-auto max-h-[320px] py-1 custom-scrollbar">
                <div
                  v-for="name in filteredThemes"
                  :key="name"
                  @click="selectTheme(name)"
                  class="px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors duration-150 capitalize font-medium"
                  :class="[
                    name === activeTheme 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'text-popover-foreground hover:bg-muted/50'
                  ]"
                >
                  <div class="flex items-center gap-3 truncate">
                    <!-- Color dots on the left -->
                    <div class="flex items-center -space-x-1.5 flex-shrink-0">
                      <div 
                        class="w-3 h-3 rounded-full border border-foreground/20 shadow-sm"
                        :style="{ backgroundColor: getThemeColor(name, 'primary') }"
                      ></div>
                      <div 
                        class="w-3 h-3 rounded-full border border-foreground/20 shadow-sm"
                        :style="{ backgroundColor: getThemeColor(name, 'secondary') }"
                      ></div>
                      <div 
                        class="w-3 h-3 rounded-full border border-foreground/20 shadow-sm"
                        :style="{ backgroundColor: getThemeColor(name, 'accent') }"
                      ></div>
                    </div>
                    <span class="truncate">{{ name === 'theme' ? 'Default (Theme)' : name.replace(/_/g, ' ') }}</span>
                  </div>
                  <!-- Checkmark for active -->
                  <svg 
                    v-if="name === activeTheme"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    class="w-3.5 h-3.5 text-primary-foreground flex-shrink-0 ml-2"
                  >
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div v-if="filteredThemes.length === 0" class="px-4 py-6 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <Frown class="w-8 h-8 text-muted-foreground/60" />
                  <span>未找到匹配的主题</span>
                </div>
              </div>
            </div>
          </div>
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
                <Palette class="w-3.5 h-3.5 text-muted-foreground" />
                <span>字体族：<span class="font-bold font-mono">Sans-Serif</span></span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Ruler class="w-3.5 h-3.5 text-muted-foreground" />
                <span>圆角值：<span class="font-bold font-mono">var(--theme-radius)</span></span>
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
                <label class="block text-xs font-semibold text-muted-foreground mb-1">带占位符的输入框</label>
                <input 
                  type="text" 
                  placeholder="这是一个带有主题色占位符的输入框..."
                  class="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-muted-foreground mb-1">文本输入框 (bg-input/border-border)</label>
                <input 
                  type="text" 
                  value="点击测试输入框焦点状态"
                  class="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition"
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
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { Moon, Sun, Frown, Palette, Ruler } from '@lucide/vue';
import { useTheme } from '../src/index';
import { defaultThemes } from '../src/themes/index';

const { theme, isDark, setTheme, toggleDarkMode } = useTheme();

// Sort themes alphabetically, but make sure the default 'theme' is always first
const availableThemes = Object.keys(defaultThemes).sort((a, b) => {
  if (a === 'theme') return -1;
  if (b === 'theme') return 1;
  return a.localeCompare(b);
});
const activeTheme = ref(theme.value);

// Dropdown state
const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref<HTMLElement | null>(null);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    searchQuery.value = '';
    // Focus search input on next tick
    setTimeout(() => {
      const searchInput = dropdownRef.value?.querySelector('input');
      searchInput?.focus();
    }, 50);
  }
}

function selectTheme(name: string) {
  activeTheme.value = name;
  setTheme(name);
  isOpen.value = false;
}

function handleOutsideClick(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function getThemeColor(themeName: string, type: 'primary' | 'secondary' | 'accent'): string {
  const themeData = defaultThemes[themeName];
  if (!themeData) return 'transparent';
  const modeData = isDark.value ? themeData.dark : themeData.light;
  return modeData[type] || 'transparent';
}

const filteredThemes = computed(() => {
  if (!searchQuery.value) return availableThemes;
  const q = searchQuery.value.toLowerCase().replace(/_/g, ' ');
  return availableThemes.filter(name => 
    name.toLowerCase().replace(/_/g, ' ').includes(q)
  );
});

watch(theme, (newTheme) => {
  activeTheme.value = newTheme;
});

// Removed getThemeEmoji to prevent duplicate and redundant emoji color indicators.
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--muted-foreground);
}
</style>
