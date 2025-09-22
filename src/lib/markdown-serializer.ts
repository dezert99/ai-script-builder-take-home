import type { Editor } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'

/**
 * Serialize editor content back to markdown format
 * Converts functionBadge nodes back to <% function UUID %> placeholders
 * 
 * @param editor - The Tiptap editor instance
 * @returns Markdown string with function placeholders
 */
export function serializeToMarkdown(editor: Editor): string {
  const json = editor.getJSON()
  return serializeJSONToMarkdown(json)
}

/**
 * Convert Tiptap JSON content to markdown
 * 
 * @param content - JSON content from Tiptap editor
 * @returns Markdown string
 */
export function serializeJSONToMarkdown(content: JSONContent): string {
  if (!content.content) {
    return ''
  }

  return content.content.map(node => serializeNode(node)).join('\n\n')
}

/**
 * Serialize a single node to markdown
 * 
 * @param node - JSON node from Tiptap
 * @returns Markdown string for the node
 */
function serializeNode(node: JSONContent): string {
  switch (node.type) {
    case 'functionBadge':
      return `<% function ${node.attrs?.functionId} %>`
    
    case 'heading':
      const level = node.attrs?.level || 1
      const headingPrefix = '#'.repeat(level)
      const headingText = serializeInlineContent(node.content || [])
      return `${headingPrefix} ${headingText}`
    
    case 'paragraph':
      return serializeInlineContent(node.content || [])
    
    case 'bulletList':
      return serializeList(node.content || [], false)
    
    case 'orderedList':
      return serializeList(node.content || [], true)
    
    case 'listItem':
      return serializeInlineContent(node.content || [])
    
    case 'blockquote':
      const quotedContent = node.content?.map(n => serializeNode(n)).join('\n') || ''
      return quotedContent.split('\n').map(line => `> ${line}`).join('\n')
    
    case 'codeBlock':
      const language = node.attrs?.language || ''
      const code = node.content?.[0]?.text || ''
      return `\`\`\`${language}\n${code}\n\`\`\``
    
    case 'horizontalRule':
      return '---'
    
    case 'hardBreak':
      return '  \n'
    
    default:
      // Fallback for unknown nodes - try to serialize their content
      if (node.content) {
        return node.content.map(n => serializeNode(n)).join('')
      }
      return node.text || ''
  }
}

/**
 * Serialize inline content (text with marks)
 * 
 * @param content - Array of inline JSON nodes
 * @returns Markdown string with inline formatting
 */
function serializeInlineContent(content: JSONContent[]): string {
  return content.map(node => {
    if (node.type === 'functionBadge') {
      return `<% function ${node.attrs?.functionId} %>`
    }
    
    if (node.type === 'text' || !node.type) {
      let text = node.text || ''
      
      // Apply marks (bold, italic, etc.)
      if (node.marks) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case 'bold':
              text = `**${text}**`
              break
            case 'italic':
              text = `*${text}*`
              break
            case 'underline':
              // Markdown doesn't have native underline, but we can preserve it with HTML
              text = `<u>${text}</u>`
              break
            case 'code':
              text = `\`${text}\``
              break
            case 'strike':
              text = `~~${text}~~`
              break
            case 'link':
              const href = mark.attrs?.href || ''
              text = `[${text}](${href})`
              break
          }
        }
      }
      
      return text
    }
    
    // Handle other inline nodes recursively
    return serializeNode(node)
  }).join('')
}

/**
 * Serialize list items
 * 
 * @param items - Array of list item nodes
 * @param ordered - Whether this is an ordered list
 * @returns Markdown string for the list
 */
function serializeList(items: JSONContent[], ordered: boolean): string {
  return items.map((item, index) => {
    const content = item.content?.map(n => serializeNode(n)).join('\n') || ''
    const prefix = ordered ? `${index + 1}. ` : '- '
    
    // Handle nested content by indenting subsequent lines
    const lines = content.split('\n')
    const firstLine = `${prefix}${lines[0] || ''}`
    const remainingLines = lines.slice(1).map(line => `   ${line}`) // 3 spaces for indentation
    
    return [firstLine, ...remainingLines].join('\n')
  }).join('\n')
}

/**
 * Validate that serialization preserves function placeholders
 * This is a debugging utility to ensure round-trip accuracy
 * 
 * @param editor - The Tiptap editor instance
 * @returns Validation results
 */
export function validateSerialization(editor: Editor): {
  markdown: string
  functionCount: number
  hasValidSyntax: boolean
} {
  const markdown = serializeToMarkdown(editor)
  const functionMatches = markdown.match(/<%\s*function\s+[a-f0-9-]+\s*%>/g) || []
  
  return {
    markdown,
    functionCount: functionMatches.length,
    hasValidSyntax: functionMatches.every(match => 
      /<%\s*function\s+[a-f0-9-]{36}\s*%>/.test(match)
    )
  }
}