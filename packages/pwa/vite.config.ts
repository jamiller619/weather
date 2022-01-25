import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: UserConfig = {
  plugins: [react(), tsconfigPaths()],
  root: __dirname,
  envDir: '../../',
  envPrefix: 'PUBLIC',
  build: {
    outDir: '../../dist/pwa',
    emptyOutDir: true,
  },
  // resolve: {
  //   alias: {
  //     '~': path.resolve(__dirname, './'),
  //   },
  // },
}

export default config
