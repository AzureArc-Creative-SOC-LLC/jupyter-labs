/**
 * Regenerates src/lib/imageManifest.ts by scanning public/images for the
 * responsive variants that exist on disk (`<name>-<width>.webp` next to
 * `<name>.webp`).
 *
 * <Img> reads the manifest to build its srcset, so a variant that was never
 * generated can never end up in a srcset as a 404. Run this after adding or
 * re-encoding any image:
 *
 *   npm run images:manifest
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// fileURLToPath, not URL.pathname — the latter leaves %20 in paths that contain spaces.
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const IMAGES_DIR = join(ROOT, 'public', 'images')
const OUT = join(ROOT, 'src', 'lib', 'imageManifest.ts')
const WIDTHS = [640, 1024, 1536]

const VARIANT_RE = new RegExp(`-(${WIDTHS.join('|')})\\.webp$`)

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const files = new Set(walk(IMAGES_DIR))
const entries = []

for (const file of [...files].sort()) {
  if (!file.endsWith('.webp') || VARIANT_RE.test(file)) continue
  const base = file.slice(0, -'.webp'.length)
  const available = WIDTHS.filter((w) => files.has(`${base}-${w}.webp`))
  if (!available.length) continue
  const src = '/' + relative(join(ROOT, 'public'), file).split(/[\\/]/).join('/')
  entries.push(`  '${src}': [${available.join(', ')}],`)
}

writeFileSync(
  OUT,
  `/**
 * Generated from the files on disk in public/images — do not hand-edit.
 * Maps an image's base src to the responsive widths that actually exist next
 * to it, so <Img> can emit a srcset without ever pointing at a missing file.
 * Regenerate with: npm run images:manifest
 */
export const IMAGE_WIDTHS: Record<string, number[]> = {
${entries.join('\n')}
}
`,
)

console.log(`imageManifest.ts — ${entries.length} images with responsive variants`)
