import { functionSpecs, type FunctionSpec } from '@/data'

/**
 * Regex pattern to match function placeholders: <% function UUID %>
 * Captures the UUID in a group for validation and replacement
 */
const FUNCTION_PLACEHOLDER_REGEX = /<%\s*function\s+([a-f0-9-]+)\s*%>/g

/**
 * Parse markdown content and replace function placeholders with function-badge tags
 * 
 * @param markdown - The markdown content to parse
 * @param specs - Array of valid function specifications (defaults to global functionSpecs)
 * @returns Processed markdown with function placeholders converted to HTML tags
 */
export function parseMarkdownWithFunctions(
  markdown: string, 
  specs: FunctionSpec[] = functionSpecs
): string {
  // Reset regex lastIndex to ensure consistent behavior on multiple calls
  FUNCTION_PLACEHOLDER_REGEX.lastIndex = 0
  
  const processedContent = markdown.replace(FUNCTION_PLACEHOLDER_REGEX, (match, functionId) => {
    // Validate that the function ID exists in our specs
    const isValid = specs.some(spec => spec.id === functionId)
    
    if (!isValid) {
      console.warn(`Invalid function ID found in markdown: ${functionId}. Keeping original placeholder.`)
      return match // Keep original placeholder if invalid
    }
    
    // Transform to HTML tag that our custom node can parse
    return `<function-badge data-function-id="${functionId}"></function-badge>`
  })
  
  return processedContent
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