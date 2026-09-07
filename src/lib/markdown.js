// src/lib/markdown.js
//
// Post bodies are markdown written in Pulse by whoever is at the shop
// computer. They are rendered with marked and then run through DOMPurify
// before they touch the DOM, so a pasted script tag or a stray on* attribute
// in a note can never execute on the storefront. External links open in a new
// tab with rel noopener, added after sanitising so the hook cannot be
// bypassed by the source text.

import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ gfm: true, breaks: false, async: false })

const purify = typeof window !== 'undefined' ? DOMPurify(window) : null

if (purify) {
  purify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || ''
      if (/^https?:\/\//i.test(href)) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
    }
    if (node.tagName === 'IMG') node.setAttribute('loading', 'lazy')
  })
}

/** renderMarkdown(md) -> safe HTML string */
export function renderMarkdown(md = '') {
  const html = marked.parse(String(md || ''))
  if (!purify) return ''
  return purify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'iframe', 'object', 'embed', 'form', 'input'],
    ADD_ATTR: ['target'],
  })
}

/** Plain text of a markdown string, for meta descriptions. */
export function markdownToText(md = '', max = 160) {
  const text = String(md || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`~-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Rough reading time in minutes. */
export function readingTime(md = '') {
  const words = String(md || '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}
