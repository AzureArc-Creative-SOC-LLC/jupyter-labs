/**
 * Runs the Vite dev server and the companion email server (server/index.js)
 * together, so `npm run dev` never leaves checkout posting to a dead
 * /api/send-order-confirmation endpoint (which surfaces as a 502 in the
 * browser — Vite proxies the request to :4001 and gets connection-refused).
 *
 * Zero dependencies: just spawns two child processes and mirrors their output.
 * Ctrl-C tears both down. If the email server exits on its own (e.g. its port
 * is already taken by an instance you started manually), Vite keeps running —
 * the proxy target simply becomes that other instance.
 */
import { spawn } from 'node:child_process'
import process from 'node:process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const procs = [
  { name: 'web  ', color: '\x1b[36m', cmd: npm, args: ['run', 'dev', '--silent'], cwd: process.cwd() },
  { name: 'email', color: '\x1b[35m', cmd: npm, args: ['start', '--silent'], cwd: 'server' },
]

const RESET = '\x1b[0m'
const children = []
let shuttingDown = false

function prefix(name, color, chunk) {
  const lines = chunk.toString().split('\n')
  if (lines[lines.length - 1] === '') lines.pop()
  for (const line of lines) process.stdout.write(`${color}[${name}]${RESET} ${line}\n`)
}

for (const p of procs) {
  const child = spawn(p.cmd, p.args, { cwd: p.cwd, shell: process.platform === 'win32' })
  children.push(child)
  child.stdout.on('data', (d) => prefix(p.name, p.color, d))
  child.stderr.on('data', (d) => prefix(p.name, p.color, d))
  child.on('exit', (code) => {
    if (shuttingDown) return
    prefix(p.name, p.color, `exited with code ${code}`)
    // The web server dying is fatal; the email server dying is survivable.
    if (p.name.trim() === 'web') shutdown(code ?? 1)
  })
}

function shutdown(code) {
  if (shuttingDown) return
  shuttingDown = true
  for (const c of children) c.kill()
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
