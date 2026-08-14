/**
 * injectDataI18n — adds data-i18n attributes to elements that use $t('key')
 * Stack-based parser that correctly associates each $t() call with its
 * nearest enclosing (rendered, non-void) element.
 */
export function injectDataI18n(content: string): string {
  const VOID = new Set([
    'input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base',
    'col', 'embed', 'source', 'track', 'wbr',
  ])
  const NON_RENDERING = new Set([
    'template', 'script', 'style', 'slot', 'clientonly', 'teleport',
    'transition', 'transitiongroup', 'keepalive', 'suspense', 'component',
  ])

  const insertions: { pos: number; text: string }[] = []
  const stack: { tagName: string; tagNameEndPos: number }[] = []

  let i = 0
  const len = content.length

  while (i < len) {
    const nextLt = content.indexOf('<', i)
    const nextDollar = content.indexOf('$t(', i)

    if (nextLt === -1 && nextDollar === -1) break

    if (nextDollar !== -1 && (nextLt === -1 || nextDollar < nextLt)) {
      i = processDollar(nextDollar)
    } else if (nextLt !== -1) {
      i = processTag(nextLt)
    } else {
      break
    }
  }

  let result = content
  for (const ins of insertions.sort((a, b) => b.pos - a.pos)) {
    result = result.slice(0, ins.pos) + ins.text + result.slice(ins.pos)
  }
  return result

  function processDollar(start: number): number {
    const match = content.slice(start).match(/^\$t\(\s*['"]([^'"]+)['"]\s*\)/)
    if (!match) return start + 1

    const key = match[1]
    const end = start + match[0].length

    if (stack.length === 0) return end

    const target = stack[stack.length - 1]
    const tagName = target.tagName

    if (VOID.has(tagName)) return end
    if (NON_RENDERING.has(tagName)) return end

    // Skip if this tag already has data-i18n (original content) or an
    // insertion is already queued for it (e.g. from an attribute $t call)
    const betweenTagAndDollar = content.slice(target.tagNameEndPos, start)
    const alreadyQueued = insertions.some(ins => ins.pos === target.tagNameEndPos)
    if (betweenTagAndDollar.includes('data-i18n=') || alreadyQueued) return end

    insertions.push({
      pos: target.tagNameEndPos,
      text: ` data-i18n="${key}"`,
    })
    return end
  }

  function processTag(start: number): number {
    const next = start + 1 < len ? content[start + 1] : ''

    // Closing tag: </tag>
    if (next === '/') {
      const closeEnd = content.indexOf('>', start + 2)
      if (closeEnd === -1) return start + 2
      const tagName = content.slice(start + 2, closeEnd).split(/[\s>/]/)[0].toLowerCase()
      if (stack.length > 0 && stack[stack.length - 1].tagName === tagName) {
        stack.pop()
      }
      return closeEnd + 1
    }

    // Comment: <!-- -->
    if (content.slice(start, start + 4) === '<!--') {
      const commentEnd = content.indexOf('-->', start + 4)
      return commentEnd !== -1 ? commentEnd + 3 : start + 4
    }

    // CDATA or DOCTYPE
    if (next === '!' && content[start + 2] !== '-') return start + 2

    // Opening tag: <tag ...>
    const tagNameMatch = content.slice(start).match(/^<([a-zA-Z][\w.-]*)/)
    if (!tagNameMatch) return start + 1

    const tagName = tagNameMatch[1].toLowerCase()
    const tagNameEnd = start + tagNameMatch[0].length

    const isVoid = VOID.has(tagName)

    // Find the closing '>', and collect any $t('key') calls inside attributes
    let tagEnd = start
    let inAttr = false
    let attrQuote = ''
    while (tagEnd < len) {
      const c = content[tagEnd]
      if (inAttr) {
        if (c === attrQuote) inAttr = false
        // Check for $t('key') inside attribute values
        if (inAttr && c === '$' && content.slice(tagEnd).startsWith('$t(')) {
          const attrMatch = content.slice(tagEnd).match(/^\$t\(\s*['"]([^'"]+)['"]\s*\)/)
          if (attrMatch && !isVoid && !NON_RENDERING.has(tagName)) {
            const key = attrMatch[1]
            // Check this tag doesn't already have data-i18n (original content
            // OR an insertion already queued for this same tag)
            const tagContent = content.slice(tagNameEnd, tagEnd)
            const alreadyQueued = insertions.some(ins => ins.pos === tagNameEnd)
            if (!tagContent.includes('data-i18n=') && !alreadyQueued) {
              insertions.push({ pos: tagNameEnd, text: ` data-i18n="${key}"` })
            }
          }
        }
      } else {
        if (c === "'" || c === '"') { inAttr = true; attrQuote = c }
        else if (c === '>') break
      }
      tagEnd++
    }
    if (tagEnd >= len) return start + 1

    const isSelfClosing = content[tagEnd - 1] === '/' || isVoid

    if (!isSelfClosing && !NON_RENDERING.has(tagName)) {
      stack.push({ tagName, tagNameEndPos: tagNameEnd })
    }

    return tagEnd + 1
  }
}
