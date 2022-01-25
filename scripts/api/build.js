import esbuild from 'esbuild'
import fs from 'fs'
import { promisify } from 'util'

const isProd = process.env.NODE_ENV === 'production'

const copyFile = promisify(fs.copyFile)

const copy = async () => {
  try {
    await copyFile('packages/api/package.json', 'dist/api/package.json')
    // await copyFile('packages/api/README.md', 'dist/api/README.md')
    // await copyFile('packages/api/LICENSE', 'dist/api/LICENSE')
  } catch {
    return process.exit(1)
  }
}

const build = async () => {
  try {
    const watch = process.argv.includes('--watch')

    if (watch === true) {
      console.log(`Starting api in watch mode...`)
    }

    const result = await esbuild.build({
      entryPoints: ['packages/api/index.ts'],
      bundle: true,
      outfile: `dist/api/index${isProd ? '.min' : ''}.js`,
      platform: 'node',
      target: 'node16.12',
      format: 'esm',
      loader: {
        '.html': 'text',
      },
      sourcemap: true,
      watch,
      minify: false,
      external: [
        '@sindresorhus/to-milliseconds',
        'deepmerge',
        'got',
        'cors',
        'dotenv',
        'express',
        'redis',
        'nanoid',
        'pify',
        'tinyduration',
      ],
    })

    if (result.errors.length > 0) {
      console.error(result.errors)
    }

    if (result.warnings.length > 0) {
      console.warn(result.warnings)
    }
  } catch {
    return process.exit(1)
  }
}

build().then(copy).catch(console.error)
