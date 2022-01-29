import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
// import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfig = {
  plugins: [react()],
  root: __dirname,
  envDir: '../../',
  envPrefix: 'PUBLIC',
  build: {
    outDir: '../../dist/pwa',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
    },
  },
}

export default config
