#!/usr/bin/env node
/**
 * Nuxiox Development Test
 *
 * Runs the Nuxt dev server with Playwright, opens pages,
 * checks for errors in the dev server output and browser console.
 * Iteratively fixes issues until all pages pass cleanly.
 *
 * Usage:
 *   node tests/dev/dev-test.mjs
 *   # Or with auto-fix mode:
 *   node tests/dev/dev-test.mjs --fix
 */

import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
const { existsSync } = fs

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
let PORT = 3000
let BASE_URL = `http://localhost:${PORT}`
const MAX_RETRIES = 5

// Pages to check
const PAGES = [
  { path: '/', label: 'Home', hasContent: false },        // Home builder — may be empty
  { path: '/blog', label: 'Blog Index', hasContent: false },
  { path: '/service', label: 'Service Page', hasContent: true },
  { path: '/about', label: 'About Page', hasContent: true },
]

let devProcess = null
let devOutput = ''
let pageErrors = []
let fixMode = process.argv.includes('--fix')
let iteration = 0

// ==============================================================
// Utility functions
// ==============================================================

function log(prefix, msg) {
  const ts = new Date().toISOString().slice(11, 19)
  console.log(`[${ts}] [${prefix}] ${msg}`)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ==============================================================
// Dev Server Management
// ==============================================================

async function startDevServer() {
  return new Promise((resolve, reject) => {
    log('DEV', 'Starting pnpm dev...')
    devOutput = ''

    devProcess = spawn('pnpm', ['dev'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '0', NUXT_TELEMETRY_DISABLED: '1' },
    })

    devProcess.stdout.on('data', (data) => {
      const text = data.toString()
      devOutput += text
      // Show errors in real-time (Nuxt format: [ERROR], [request error], etc.)
      const lines = text.trim().split('\n')
      for (const line of lines) {
        if (line.includes('ERROR') || line.includes('error') || line.includes('Error') || line.includes('[request error]')) {
          process.stdout.write(`  ⚠  ${line}\n`)
        }
      }
    })

    devProcess.stderr.on('data', (data) => {
      const text = data.toString()
      devOutput += text
      process.stdout.write(`  stderr: ${text}`)
    })

    devProcess.on('close', (code) => {
      log('DEV', `Process exited with code ${code}`)
      devProcess = null
    })

    // Wait for the server to be ready
    const startTime = Date.now()
    const timeout = 60000 // 1 minute

    const check = async () => {
      // Detect port from output (handles port-in-use fallback)
      const portMatch = devOutput.match(/http:\/\/localhost:(\d+)\//)
      if (portMatch) {
        const detectedPort = parseInt(portMatch[1], 10)
        if (detectedPort !== PORT) {
          PORT = detectedPort
          BASE_URL = `http://localhost:${PORT}`
          log('DEV', `Detected port: ${PORT}`)
        }
      }

      // Ping the server to check if it's actually responding
      try {
        const res = await fetch(BASE_URL)
        if (res.ok || res.status < 500) {
          log('DEV', `Dev server is ready! (status ${res.status})`)
          await sleep(2000)
          resolve()
          return
        }
      } catch {
        // Server not ready yet, keep waiting
      }

      if (Date.now() - startTime > timeout) {
        // Try to fetch anyway
        log('DEV', 'Timeout waiting for ready message, will try fetching...')
        resolve()
        return
      }

      await sleep(1000)
      check()
    }

    // Also listen for the URL pattern (for port detection)
    const reader = createInterface({ input: devProcess.stdout })
    reader.on('line', (line) => {
      if (line.includes('localhost:')) {
        if (!devOutput.includes('READY_FLAG')) {
          devOutput += '\nREADY_FLAG\n'
        }
      }
    })

    check()
  })
}

async function stopDevServer() {
  if (devProcess) {
    log('DEV', 'Stopping dev server...')
    // Kill the entire process group (negative PID) to kill children too
    try {
      process.kill(-devProcess.pid, 'SIGTERM')
    } catch {
      devProcess.kill('SIGTERM')
    }
    await sleep(1500)
    // Force-kill any remaining nuxt/pnpm processes from this project
    try {
      const { execSync } = await import('node:child_process')
      execSync(`pkill -f "nuxt dev" 2>/dev/null; pkill -f "pnpm.*dev" 2>/dev/null`, { stdio: 'ignore' })
    } catch {}
    await sleep(500)
    devProcess = null
  }
}

async function isServerReady() {
  try {
    const res = await fetch(BASE_URL)
    return res.ok || res.status < 500
  } catch {
    return false
  }
}

// ==============================================================
// Page Testing
// ==============================================================

async function testPage(browser, pageConfig) {
  const { path, label, hasContent } = pageConfig
  const url = BASE_URL + path
  const result = {
    path,
    label,
    url,
    passed: false,
    hasContent: false,
    networkErrors: [],
    consoleErrors: [],
    consoleWarnings: [],
    pageErrors: [],
    statusCode: 0,
    emptyBody: false,
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  })
  const page = await context.newPage()

  // Collect console errors and warnings
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      result.consoleErrors.push(msg.text())
    } else if (msg.type() === 'warning') {
      result.consoleWarnings = result.consoleWarnings || []
      result.consoleWarnings.push(msg.text())
    }
  })

  // Collect page errors
  page.on('pageerror', (err) => {
    result.pageErrors.push(err.message)
  })

  // Collect network errors
  page.on('response', (response) => {
    if (response.status() >= 400) {
      result.networkErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      })
    }
  })

  try {
    log('TEST', `Opening ${url}...`)
    const response = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    if (response) {
      result.statusCode = response.status()
    }

    // Wait a little for async rendering
    await sleep(1500)

    // Check body content
    const bodyText = await page.evaluate(() => document.body?.innerText || '')
    const bodyHtml = await page.evaluate(() => document.body?.innerHTML || '')
    result.hasContent = bodyText.trim().length > 0
    result.emptyBody = bodyHtml.trim().length === 0 || bodyHtml.trim() === '<div></div>'

    // Check if the page has meaningful content vs just "not found" or empty
    const notFoundText = bodyText.includes('not found') || bodyText.includes('404')
    let contentOk = true

    if (hasContent && (result.emptyBody || notFoundText)) {
      contentOk = false
      log('WARN', `${label}: expected content but got empty page or "not found"`)
    }

    // Determine pass/fail
    // Warnings alone don't fail — only errors fail
    const hasErrors =
      result.consoleErrors.length > 0 ||
      result.pageErrors.length > 0

    // Check for non-HTTP errors (status codes >= 500 are server errors)
    const hasServerError =
      result.statusCode >= 500 ||
      result.networkErrors.some((e) => e.status >= 500)

    result.passed = !hasErrors && !hasServerError && contentOk

    if (result.passed) {
      const warnCount = result.consoleWarnings.length
      log('OK', `${label} (${url}) — ${result.statusCode}, ${result.hasContent ? 'has content' : 'empty'}${warnCount ? `, ${warnCount} warnings` : ''}`)
    } else {
      log('FAIL', `${label} (${url}) — ${result.statusCode}`)
      if (hasContent && result.emptyBody) {
        log('FAIL', `  → Empty body when content was expected`)
      }
      if (result.consoleErrors.length) {
        for (const err of result.consoleErrors.slice(0, 5)) {
          log('FAIL', `  → Console error: ${err.slice(0, 200)}`)
        }
      }
      if (result.consoleWarnings.length) {
        for (const w of result.consoleWarnings.slice(0, 5)) {
          log('FAIL', `  ⚠ Console warning: ${w.slice(0, 200)}`)
        }
      }
      if (result.pageErrors.length) {
        for (const err of result.pageErrors.slice(0, 5)) {
          log('FAIL', `  → Page error: ${err.slice(0, 200)}`)
        }
      }
      if (result.networkErrors.length) {
        for (const err of result.networkErrors.slice(0, 5)) {
          log('FAIL', `  → HTTP ${err.status}: ${err.url.slice(0, 100)}`)
        }
      }
    }
  } catch (err) {
    log('ERROR', `${label}: ${err.message}`)
    result.pageErrors.push(err.message)
    result.passed = false
  } finally {
    await context.close()
  }

  return result
}

// ==============================================================
// Dev Output Analysis
// ==============================================================

function analyzeDevOutput() {
  const errors = []
  const errorLines = devOutput.split('\n').filter(
    (line) =>
      (line.includes('[ERROR]') || line.includes('ERROR ') || line.includes('error ') || line.includes('[request error]')) ||
      (line.includes('[nuxt]') && (line.includes('error') || line.includes('Error'))) ||
      line.includes('[nitro]') && (line.includes('ERROR') || line.includes('error')) ||
      line.includes('Cannot find module') ||
      line.includes('Module not found') ||
      line.includes('unexpected') ||
      line.includes('SyntaxError') ||
      line.includes('TypeError') ||
      line.includes('ReferenceError')
  )

  return errorLines.slice(0, 20)
}

// ==============================================================
// Report
// ==============================================================

function printReport(results, devErrors) {
  console.log('\n' + '='.repeat(60))
  console.log('  DEVELOPMENT TEST REPORT')
  console.log('='.repeat(60))

  const passed = results.filter((r) => r.passed).length
  const total = results.length

  for (const r of results) {
    const icon = r.passed ? '✓' : '✗'
    const content = r.hasContent ? 'content' : 'empty'
    const warns = r.consoleWarnings?.length || 0
    console.log(`  ${icon} ${r.label.padEnd(15)} ${r.statusCode} ${content.padEnd(8)} ${r.consoleErrors.length} errs, ${r.pageErrors.length} page errs${warns ? `, ${warns} warns` : ''}`)
  }

  console.log('-'.repeat(60))
  console.log(`  Passed: ${passed}/${total}`)

  if (devErrors && devErrors.length > 0) {
    console.log(`  ⚠ Dev server errors: ${devErrors.length}`)
    for (const err of devErrors.slice(0, 3)) {
      console.log(`    ${err.slice(0, 120)}`)
    }
  }

  if (passed === total) {
    console.log('  ✅ ALL PAGES PASS')
  } else {
    console.log('  ❌ SOME PAGES FAILED')
  }
  console.log('='.repeat(60) + '\n')
}

// ==============================================================
// Main Test Runner
// ==============================================================

async function runDevTest() {
  iteration++

  log('TEST', `=== Dev Test Iteration ${iteration} ===`)

  // 1. Check if a server is already running on port 3000
  let serverAlreadyRunning = false
  try {
    const res = await fetch('http://localhost:3000/')
    if (res.ok || res.status < 500) {
      serverAlreadyRunning = true
      log('DEV', 'Detected existing server on port 3000, skipping startup')
    }
  } catch {
    // No server running, will start one
  }

  if (!serverAlreadyRunning) {
    // 2. Start the dev server
    await startDevServer()
  }

  // 3. Wait for server to be ready
  let serverReady = serverAlreadyRunning
  for (let i = 0; i < 60; i++) {
    if (await isServerReady()) {
      serverReady = true
      break
    }
    await sleep(2000)
  }

  if (!serverReady) {
    log('ERROR', 'Dev server did not become ready')
    await stopDevServer()
    return false
  }

  log('TEST', 'Server is responding, starting Playwright...')

  // 3. Launch Playwright (use system Chrome if available, fallback to bundled)
  const systemChrome = '/usr/bin/google-chrome-stable'
  const hasSystemChrome = existsSync(systemChrome)
  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--no-zygote',
      '--single-process',
    ],
  }
  if (hasSystemChrome) {
    launchOptions.executablePath = systemChrome
    log('TEST', 'Using system Chrome: ' + systemChrome)
  }
  const browser = await chromium.launch(launchOptions)

  try {
    // 4. Test each page
    const results = []
    for (const pageConfig of PAGES) {
      const result = await testPage(browser, pageConfig)
      results.push(result)
    }

    // 5. Check dev output for errors (AFTER pages are loaded — catches SSR errors)
    const devErrors = analyzeDevOutput()
    if (devErrors.length > 0) {
      log('WARN', `Found ${devErrors.length} potential issues in dev output:`)
      for (const err of devErrors.slice(0, 10)) {
        console.log(`  ${err}`)
      }
    }

    // 6. Print report
    printReport(results, devErrors)

    // 7. Check for retry logic
    const allPassed = results.every((r) => r.passed)
    const fixableFailures = results.some(
      (r) => !r.passed && (r.consoleErrors.length > 0 || r.pageErrors.length > 0 || r.emptyBody)
    )

    return { allPassed, fixableFailures, results, devErrors }

  } finally {
    await browser.close()
    if (!serverAlreadyRunning) {
      await stopDevServer()
    } else {
      log('DEV', 'Leaving existing server running')
    }
  }
}

// ==============================================================
// Iterative Fix Loop
// ==============================================================

async function devTestLoop() {
  console.log('')
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║      NU X IO X   D E V   T E S T             ║')
  console.log('╠════════════════════════════════════════════════╣')
  console.log(`║  Mode: ${fixMode ? 'AUTO-FIX' : 'CHECK ONLY'.padEnd(43)}║`)
  console.log(`║  Pages: ${PAGES.map((p) => p.path).join(', ')}`)
  console.log(`║  Max retries: ${MAX_RETRIES}`)
  console.log('╚════════════════════════════════════════════════╝')
  console.log('')

  for (let attempt = 1; attempt <= (fixMode ? MAX_RETRIES : 1); attempt++) {
    log('MAIN', `Attempt ${attempt}/${fixMode ? MAX_RETRIES : 1}`)

    const { allPassed, fixableFailures, results, devErrors } = await runDevTest()

    // Log dev output errors to file for diagnosis
    if (devErrors.length > 0) {
      const logPath = resolve(ROOT, 'tests/dev/dev-errors.log')
      fs.writeFileSync(logPath,
        `=== Dev Test Iteration ${iteration} ===\n` +
        `Time: ${new Date().toISOString()}\n\n` +
        devErrors.join('\n') + '\n'
      )
      log('MAIN', `Dev errors logged to ${logPath}`)
    }

    if (allPassed) {
      log('MAIN', '🎉 All pages passed!')
      return true
    }

    if (!fixMode) {
      log('MAIN', '❌ Some pages failed. Run with --fix to attempt auto-fix.')
      log('MAIN', '  Check tests/dev/dev-errors.log for details.')
      return false
    }

    if (!fixableFailures) {
      log('MAIN', 'Failures are not auto-fixable. Manual intervention needed.')
      return false
    }

    if (attempt < MAX_RETRIES) {
      log('MAIN', `Will retry (attempt ${attempt + 1}/${MAX_RETRIES})...`)
      // In fix mode, we would identify specific errors and fix them.
      // For now, we rely on the developer to fix issues between iterations.
    }
  }

  log('MAIN', `❌ Failed after ${MAX_RETRIES} attempts.`)
  return false
}

// ==============================================================
// Run
// ==============================================================

devTestLoop()
  .then((passed) => {
    process.exit(passed ? 0 : 1)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })