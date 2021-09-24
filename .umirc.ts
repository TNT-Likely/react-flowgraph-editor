import { defineConfig } from 'dumi';

export default defineConfig({
  title: '流程图编辑器',
  favicon: '/icon.png',
  logo: '/icon.png',
  outputPath: 'docs-dist',
  mode: 'site',
  // mfsu: {},
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib', // default: lib
        style: true,
      },
    ],
  ],
  theme: {
    '@primary-color': '#1DA57A',
  },
  // more config: https://d.umijs.org/config
});
