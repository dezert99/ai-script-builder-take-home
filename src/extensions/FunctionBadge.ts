import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

export const FunctionBadge = Node.create({
  name: 'functionBadge',
  group: 'inline',
  inline: true,
  atom: true,
  
  addAttributes() {
    return {
      functionId: {
        default: null,
        parseHTML: element => element.getAttribute('data-function-id'),
        renderHTML: attributes => {
          return { 'data-function-id': attributes.functionId }
        },
      },
    }
  },
  
  parseHTML() {
    return [
      {
        tag: 'function-badge',
      },
    ]
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['function-badge', HTMLAttributes]
  },
  
  addNodeView() {
    // This will be imported from the component we create in Task 2
    // For now, we'll use a placeholder that will be replaced
    return ReactNodeViewRenderer(() => null) // Temporary placeholder
  },
})