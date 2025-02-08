import { defineConfig } from 'vite';
import path from 'path';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import EslintPlugin from 'vite-plugin-eslint';
import topLevelAwait from 'vite-plugin-top-level-await';
import ElementPlus from 'unplugin-element-plus/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { MonoseVueResolver } from 'monose-component-vue/provider';

export default defineConfig({
  build: {
    outDir: './server/public',
  },
  server: {
    open: true,
    host: '0.0.0.0',
    hmr: true,
    port: 9000,
    proxy: {
      '/api': {
        // target: 'http://10.8.15.0:8080/',
        // target: 'http://10.8.9.6:8080/', // 本地环境
        // target: 'http://47.95.215.215:8801/', // 测试环境
        target: 'http://101.52.217.169:30100/api', // 测试环境
        // target: 'http://59.110.166.192:8801/', // 生产环境
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    Vue(),
    vueJsx({}),
    ElementPlus({}),
    AutoImport({
      resolvers: [ElementPlusResolver({ importStyle: false })],
    }),
    Components({
      resolvers: [MonoseVueResolver, ElementPlusResolver({ importStyle: false })],
    }),
    EslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.vue', 'src/*.ts', 'src/*.js', 'src/*.vue'],
      exclude: ['src/styles/iconfont/iconfont.js'],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@UI': path.resolve(__dirname, './src/components/AAUI'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
});
