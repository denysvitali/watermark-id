import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
const sourceServiceWorker = new URL('../public/sw.js', import.meta.url)
const outputServiceWorker = new URL('../dist/sw.js', import.meta.url)

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? listFiles(path) : [path]
    }),
  )
  return nestedFiles.flat()
}

const files = (await listFiles(outputDirectory))
  .map((file) => relative(outputDirectory, file).split(sep).join('/'))
  .filter((file) => file !== 'sw.js')
  .map((file) => `./${file}`)
  .sort()

files.unshift('./')

const source = await readFile(sourceServiceWorker, 'utf8')
const generated = source.replace(
  'const APP_SHELL = []',
  `const APP_SHELL = ${JSON.stringify(files, null, 2)}`,
)

await writeFile(outputServiceWorker, generated)
