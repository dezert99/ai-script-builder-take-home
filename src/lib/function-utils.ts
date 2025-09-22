import { functionSpecs, availableFunctions, type FunctionSpec } from '@/data'

/**
 * Get function spec by ID
 */
export function getFunctionSpec(functionId: string): FunctionSpec | undefined {
  return functionSpecs.find(spec => spec.id === functionId)
}

/**
 * Get function name from internal ID
 */
export function getFunctionName(functionInternalId: string): string {
  const entry = Object.entries(availableFunctions).find(
    ([, value]) => value === functionInternalId
  )
  return entry ? entry[0] : 'Unknown'
}

/**
 * Get display name for a function spec
 */
export function getFunctionDisplayName(spec: FunctionSpec): string {
  const name = getFunctionName(spec.function_internal_id)
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Validate if a function ID exists
 */
export function isValidFunctionId(functionId: string): boolean {
  return functionSpecs.some(spec => spec.id === functionId)
}

/**
 * Get all available function specs
 */
export function getAllFunctionSpecs(): FunctionSpec[] {
  return functionSpecs
}