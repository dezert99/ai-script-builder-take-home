import { functionSpecs, type FunctionSpec } from '@/data'

/**
 * Regex pattern to match function placeholders: <% function UUID %>
 * Captures the UUID in a group for validation and replacement
 * Updated to handle any alphanumeric characters and hyphens (not just hex)
 */
const FUNCTION_PLACEHOLDER_REGEX = /<%\s*function\s+([a-zA-Z0-9-]+)\s*%>/g

/**
 * Parse markdown content and replace function placeholders with function-badge tags
 * 
 * @param markdown - The markdown content to parse
 * @param specs - Array of valid function specifications (defaults to global functionSpecs)
 * @returns Processed markdown with function placeholders converted to HTML tags
 */
import type { JSONContent } from '@tiptap/core'

export function parseMarkdownWithFunctions(
  markdown: string, 
  specs: FunctionSpec[] = functionSpecs
): JSONContent {
  // Reset regex lastIndex to ensure consistent behavior on multiple calls
  FUNCTION_PLACEHOLDER_REGEX.lastIndex = 0
  
  // Split markdown into blocks
  const blocks = markdown.split('\n\n').filter(block => block.trim())
  
  const content: JSONContent[] = []
  
  for (const block of blocks) {
    const trimmedBlock = block.trim()
    
    // Check if it's a heading
    if (trimmedBlock.startsWith('# ')) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: parseInlineContent(trimmedBlock.substring(2), specs)
      })
    } else if (trimmedBlock.startsWith('## ')) {
      content.push({
        type: 'heading',
        attrs: { level: 2 },
        content: parseInlineContent(trimmedBlock.substring(3), specs)
      })
    } else if (trimmedBlock.startsWith('### ')) {
      content.push({
        type: 'heading',
        attrs: { level: 3 },
        content: parseInlineContent(trimmedBlock.substring(4), specs)
      })
    } else {
      // Check if this block contains list items
      const lines = trimmedBlock.split('\n').filter(line => line.trim())
      
      // Check if all lines are ordered list items (1. 2. 3. etc.)
      const orderedListRegex = /^\d+\.\s+(.+)$/
      const allOrderedList = lines.every(line => orderedListRegex.test(line.trim()))
      
      // Check if all lines are unordered list items (- or *)
      const unorderedListRegex = /^[-*]\s+(.+)$/
      const allUnorderedList = lines.every(line => unorderedListRegex.test(line.trim()))
      
      if (allOrderedList) {
        // Create ordered list
        const listItems = lines.map(line => {
          const match = line.trim().match(orderedListRegex)
          return {
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: parseInlineContent(match![1], specs)
            }]
          }
        })
        
        content.push({
          type: 'orderedList',
          content: listItems
        })
      } else if (allUnorderedList) {
        // Create unordered list  
        const listItems = lines.map(line => {
          const match = line.trim().match(unorderedListRegex)
          return {
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: parseInlineContent(match![1], specs)
            }]
          }
        })
        
        content.push({
          type: 'bulletList',
          content: listItems
        })
      } else {
        // It's a regular paragraph
        let paragraphContent = ''
        
        for (const line of lines) {
          if (line.trim()) {
            paragraphContent += (paragraphContent ? ' ' : '') + line.trim()
          }
        }
        
        if (paragraphContent) {
          content.push({
            type: 'paragraph',
            content: parseInlineContent(paragraphContent, specs)
          })
        }
      }
    }
  }
  
  return {
    type: 'doc',
    content
  }
}

function parseInlineContent(text: string, specs: FunctionSpec[]): JSONContent[] {
  const content: JSONContent[] = []
  let currentPos = 0
  
  // Find all function placeholders
  let match
  FUNCTION_PLACEHOLDER_REGEX.lastIndex = 0
  
  while ((match = FUNCTION_PLACEHOLDER_REGEX.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentPos) {
      const beforeText = text.substring(currentPos, match.index)
      content.push(...parseTextWithFormatting(beforeText))
    }
    
    // Add the function badge
    const functionId = match[1]
    const isValid = specs.some(spec => spec.id === functionId)
    
    if (isValid) {
      content.push({
        type: 'functionBadge',
        attrs: {
          functionId: functionId
        }
      })
    } else {
      // If invalid, keep as text
      content.push({ type: 'text', text: match[0] })
    }
    
    currentPos = match.index + match[0].length
  }
  
  // Add remaining text
  if (currentPos < text.length) {
    const remainingText = text.substring(currentPos)
    content.push(...parseTextWithFormatting(remainingText))
  }
  
  return content.filter(item => item.text !== '' || item.type !== 'text')
}

function parseTextWithFormatting(text: string): JSONContent[] {
  if (!text) return []
  
  // Simple bold formatting
  const boldRegex = /\*\*(.*?)\*\*/g
  const content: JSONContent[] = []
  let currentPos = 0
  let match
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > currentPos) {
      const beforeText = text.substring(currentPos, match.index)
      if (beforeText) {
        content.push({ type: 'text', text: beforeText })
      }
    }
    
    // Add bold text
    content.push({
      type: 'text',
      text: match[1],
      marks: [{ type: 'bold' }]
    })
    
    currentPos = match.index + match[0].length
  }
  
  // Add remaining text
  if (currentPos < text.length) {
    const remainingText = text.substring(currentPos)
    if (remainingText) {
      content.push({ type: 'text', text: remainingText })
    }
  }
  
  // If no formatting found, just return the text
  if (content.length === 0 && text) {
    return [{ type: 'text', text: text }]
  }
  
  return content
}

/**
 * Extract all function IDs from markdown content (for validation/analysis)
 * 
 * @param markdown - The markdown content to analyze
 * @returns Array of function IDs found in the content
 */
export function extractFunctionIds(markdown: string): string[] {
  // Reset regex lastIndex
  FUNCTION_PLACEHOLDER_REGEX.lastIndex = 0
  
  const functionIds: string[] = []
  let match
  
  while ((match = FUNCTION_PLACEHOLDER_REGEX.exec(markdown)) !== null) {
    functionIds.push(match[1])
  }
  
  return functionIds
}

/**
 * Validate that all function IDs in markdown content are valid
 * 
 * @param markdown - The markdown content to validate
 * @param specs - Array of valid function specifications (defaults to global functionSpecs)
 * @returns Object with validation results
 */
export function validateFunctionIds(
  markdown: string, 
  specs: FunctionSpec[] = functionSpecs
): {
  isValid: boolean
  validIds: string[]
  invalidIds: string[]
  totalFound: number
} {
  const foundIds = extractFunctionIds(markdown)
  const validIds: string[] = []
  const invalidIds: string[] = []
  
  foundIds.forEach(id => {
    const isValid = specs.some(spec => spec.id === id)
    if (isValid) {
      validIds.push(id)
    } else {
      invalidIds.push(id)
    }
  })
  
  return {
    isValid: invalidIds.length === 0,
    validIds,
    invalidIds,
    totalFound: foundIds.length
  }
}

/**
 * Get statistics about function usage in markdown
 * NOTE: This function is primarily for debugging and development purposes
 * 
 * @param markdown - The markdown content to analyze
 * @param specs - Array of valid function specifications (defaults to global functionSpecs)
 * @returns Statistics object
 */
export function getFunctionStats(
  markdown: string, 
  specs: FunctionSpec[] = functionSpecs
): {
  totalPlaceholders: number
  uniqueFunctions: number
  functionCounts: Record<string, number>
  validationResults: ReturnType<typeof validateFunctionIds>
} {
  const foundIds = extractFunctionIds(markdown)
  const functionCounts: Record<string, number> = {}
  
  // Count occurrences of each function ID
  foundIds.forEach(id => {
    functionCounts[id] = (functionCounts[id] || 0) + 1
  })
  
  return {
    totalPlaceholders: foundIds.length,
    uniqueFunctions: Object.keys(functionCounts).length,
    functionCounts,
    validationResults: validateFunctionIds(markdown, specs)
  }
}