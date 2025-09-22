# AI Script Builder - Implementation Tasks

## Task Management Instructions
- Mark task as `🟡 In Progress` when starting
- Mark task as `🔵 Pending Review` when complete
- After review approval, mark as `✅ Complete`
- **DO NOT** start next task until review is approved
- Provide commit message after each completed task

---

## Task 1: Create FunctionBadge Custom Node Extension
**Status**: ✅ Complete
**Priority**: HIGH  
**Complexity**: MODERATE  
**Dependencies**: None  

### Description
Create a custom Tiptap node to represent function placeholders in the editor. This node will be the foundation for rendering interactive badges instead of plain text placeholders.

### Acceptance Criteria
- [ ] Custom node recognizes function placeholder pattern
- [ ] Node stores functionId as an attribute
- [ ] Node is configured as inline, atomic
- [ ] Node integrates with Tiptap editor

### Implementation Steps
1. Create `src/extensions/FunctionBadge.ts`
2. Define node schema with functionId attribute
3. Configure parseHTML and renderHTML rules
4. Set up ReactNodeViewRenderer for custom component
5. Export the extension

### Files to Create/Modify
- `src/extensions/FunctionBadge.ts` (NEW)

### Implementation Guidance
```typescript
// Core structure for the custom node
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
    return ReactNodeViewRenderer(FunctionBadgeComponent) // Component from Task 2
  },
})
```

---

## Task 2: Create FunctionBadgeComponent
**Status**: ✅ Complete
**Priority**: HIGH  
**Complexity**: HIGH  
**Dependencies**: Task 1  

### Description
Build the React component that renders function badges with interactive features: tooltip on hover, dropdown on click, and delete with confirmation.

### Acceptance Criteria
- [ ] Badge displays with visual styling
- [ ] Tooltip shows function description on hover
- [ ] Dropdown menu opens on click
- [ ] Can select different function from dropdown
- [ ] Delete requires confirmation
- [ ] Component updates node attributes

### Implementation Steps
1. Create `src/components/FunctionBadgeComponent.tsx`
2. Implement tooltip using Radix UI
3. Add dropdown menu for function selection
4. Create confirmation dialog for deletion
5. Connect to node attributes via props

### Files to Create/Modify
- `src/components/FunctionBadgeComponent.tsx` (NEW)
- `src/lib/function-utils.ts` (NEW - helper functions)
- `package.json` (ADD @radix-ui/react-tooltip, @radix-ui/react-dialog)

### Implementation Guidance
```typescript
// Key interfaces and structure
interface FunctionBadgeProps {
  node: {
    attrs: {
      functionId: string
    }
  }
  updateAttributes: (attrs: { functionId: string }) => void
  deleteNode: () => void
  editor: any
}

// Use existing functionSpecs from src/data/index.ts
// Implement with Radix UI components for consistency
```

---

## Task 3: Implement Markdown Parser for Functions
**Status**: ✅ Complete 
**Priority**: HIGH  
**Complexity**: MODERATE  
**Dependencies**: Tasks 1, 2  

### Description
Create parser that identifies `<% function UUID %>` patterns in markdown and converts them to function badge nodes when loading content into the editor.

### Acceptance Criteria
- [ ] Parser identifies all function placeholders
- [ ] Validates function IDs exist in functionSpecs
- [ ] Replaces placeholders with function nodes
- [ ] Preserves all other markdown formatting
- [ ] Handles edge cases (invalid IDs, malformed syntax)

### Implementation Steps
1. Create `src/lib/markdown-parser.ts`
2. Implement regex pattern matching for `<% function UUID %>`
3. Validate function IDs against functionSpecs
4. Transform to Tiptap-compatible format
5. Integrate with editor initialization

### Files to Create/Modify
- `src/lib/markdown-parser.ts` (NEW)
- `src/components/Editor.tsx` (MODIFY - use parser on content)

### Implementation Guidance
```typescript
// Parser function structure
export function parseMarkdownWithFunctions(markdown: string, functionSpecs: FunctionSpec[]) {
  const functionRegex = /<%\s*function\s+([a-f0-9-]+)\s*%>/g;
  
  // Validate and replace pattern
  const processedContent = markdown.replace(functionRegex, (match, functionId) => {
    const isValid = functionSpecs.some(spec => spec.id === functionId);
    if (!isValid) {
      console.warn(`Invalid function ID: ${functionId}`);
      return match; // Keep original if invalid
    }
    return `<function-badge data-function-id="${functionId}"></function-badge>`;
  });
  
  return processedContent;
}
```

---

## Task 4: Implement Markdown Serializer
**Status**: ✅ Complete   
**Priority**: HIGH  
**Complexity**: MODERATE  
**Dependencies**: Tasks 1-3  

### Description
Create serializer that converts editor content back to markdown, replacing function badge nodes with `<% function UUID %>` placeholders.

### Acceptance Criteria
- [ ] Serializes all function nodes to placeholder syntax
- [ ] Preserves all markdown formatting
- [ ] Maintains document structure
- [ ] Handles nested formatting correctly
- [ ] Output is valid markdown

### Implementation Steps
1. Create `src/lib/markdown-serializer.ts`
2. Implement custom serialization for function nodes
3. Preserve standard markdown elements
4. Add export functionality to editor
5. Test round-trip conversion

### Files to Create/Modify
- `src/lib/markdown-serializer.ts` (NEW)
- `src/components/Editor.tsx` (MODIFY - add export button/function)
- `src/components/EditorHeader.tsx` (MODIFY - add export button)

### Implementation Guidance
```typescript
// Use Tiptap's built-in markdown extension if available, or implement custom
import { getMarkdownFromContent } from '@tiptap/markdown';

export function serializeToMarkdown(editor: Editor) {
  const json = editor.getJSON();
  
  // Custom node handler for functionBadge
  const customSerializers = {
    functionBadge: (node: any) => {
      return `<% function ${node.attrs.functionId} %>`;
    }
  };
  
  // Combine with default markdown serialization
  return serializeWithCustomNodes(json, customSerializers);
}
```

---

## Task 4.5: Enhance Export with Copy/Download Options
**Status**: ✅ Complete  
**Priority**: MEDIUM  
**Complexity**: LOW  
**Dependencies**: Task 4  

### Description
Enhance the export functionality to provide users with options to either copy the markdown to clipboard or download it as a .md file through a dropdown menu.

### Acceptance Criteria
- [ ] Replace simple export button with dropdown menu
- [ ] "Copy to Clipboard" option with success feedback
- [ ] "Download as File" option that saves .md file
- [ ] Clean UI with appropriate icons for each option
- [ ] Proper error handling for both operations

### Implementation Steps
1. Update EditorHeader to use DropdownMenu from Radix UI
2. Implement copy to clipboard functionality
3. Implement file download functionality
4. Update App.tsx to handle multiple export types
5. Add appropriate icons and styling
6. Test both options work correctly

### Files to Modify
- `src/components/EditorHeader.tsx` (MODIFY - replace button with dropdown)
- `src/App.tsx` (MODIFY - handle export type parameter)
- `src/components/Editor.tsx` (MODIFY - if needed for export type handling)

### Implementation Guidance
```typescript
// Dropdown menu structure
<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4" />
      Export
      <ChevronDown className="h-4 w-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onSelect={() => handleExport('copy')}>
      <Copy className="h-4 w-4" />
      Copy to Clipboard
    </DropdownMenu.Item>
    <DropdownMenu.Item onSelect={() => handleExport('download')}>
      <Download className="h-4 w-4" />
      Download as File
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>

// File download implementation
const downloadMarkdown = (content: string, filename = 'script.md') => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

---

## Task 5: Complete Editor Integration
**Status**: ✅ Complete 
**Priority**: HIGH  
**Complexity**: MODERATE  
**Dependencies**: Tasks 1-4  

### Description
Integrate all components into the main editor, ensuring smooth data flow and user experience.

### Acceptance Criteria
- [ ] Editor initializes with parsed markdown
- [ ] Function badges render correctly
- [ ] All interactions work (tooltip, dropdown, delete)
- [ ] Export produces valid markdown
- [ ] Sample script loads correctly

### Implementation Steps
1. Update `src/components/Editor.tsx`
2. Add FunctionBadge extension to editor config
3. Parse initial content with function parser
4. Add export functionality
5. Test all features together

### Files to Modify
- `src/components/Editor.tsx` (MODIFY)
- `src/App.tsx` (MODIFY - if needed for state management)

### Implementation Guidance
```typescript
// Updated editor configuration
import { FunctionBadge } from '@/extensions/FunctionBadge';
import { parseMarkdownWithFunctions } from '@/lib/markdown-parser';
import { serializeToMarkdown } from '@/lib/markdown-serializer';
import { functionSpecs } from '@/data';

const editor = useEditor({
  extensions: [
    StarterKit,
    FunctionBadge,
    Placeholder.configure({
      placeholder: "Start writing your script...",
    }),
  ],
  content: parseMarkdownWithFunctions(SAMPLE_SCRIPT, functionSpecs),
  onCreate: ({ editor }) => {
    // Initial setup if needed
  },
});

// Add export function
const handleExport = () => {
  const markdown = serializeToMarkdown(editor);
  console.log('Exported markdown:', markdown);
  // Could copy to clipboard or download
};
```

---

## Task 5.5: Add Editor Toolbar with Formatting Controls
**Status**: ✅ Complete  
**Priority**: HIGH  
**Complexity**: MODERATE  
**Dependencies**: Task 5  

### Description
Add a toolbar above the editor with formatting controls for headings, bold, italic, lists, and horizontal rules. Also fix the markdown parsing to properly render headings and structure.

### Acceptance Criteria
- [ ] Toolbar with heading buttons (H1, H2, H3)
- [ ] Bold and italic formatting buttons
- [ ] Bullet list and numbered list buttons  
- [ ] Horizontal rule button
- [ ] Proper markdown parsing that renders headings as headings
- [ ] Clean, consistent styling with existing UI

### Implementation Steps
1. Create EditorToolbar component with formatting buttons
2. Fix markdown parsing to use proper Tiptap content initialization
3. Add toolbar button handlers for each formatting option
4. Style toolbar to match existing design
5. Integrate toolbar with Editor component

### Files to Create/Modify
- `src/components/EditorToolbar.tsx` (NEW)
- `src/components/Editor.tsx` (MODIFY - add toolbar and fix content parsing)
- `src/lib/markdown-parser.ts` (MODIFY - fix parsing approach)

### Implementation Guidance
```typescript
// Use Tiptap commands for formatting
editor.chain().focus().toggleHeading({ level: 1 }).run()
editor.chain().focus().toggleBold().run()
editor.chain().focus().toggleBulletList().run()
editor.chain().focus().setHorizontalRule().run()

// Use proper content initialization instead of HTML strings
const editor = useEditor({
  extensions: [...],
  content: {
    type: 'doc',
    content: [
      // Proper JSON content structure
    ]
  }
})
```

---

## Task 6: Implement Slash Commands (STRETCH)
**Status**: ✅ Complete   
**Priority**: MEDIUM  
**Complexity**: HIGH  
**Dependencies**: Tasks 1-5  

### Description
Implement slash command menu that appears when typing `/` and allows selection of functions to insert.

### Acceptance Criteria
- [ ] Menu appears when typing `/`
- [ ] Shows all available functions with name and description
- [ ] Keyboard navigation (arrows, enter, escape)
- [ ] Mouse selection works
- [ ] Filters as user types
- [ ] Inserts function badge on selection

### Implementation Steps
1. Create `src/extensions/SlashCommands.ts`
2. Create `src/components/SlashCommandMenu.tsx`
3. Implement suggestion plugin
4. Add keyboard navigation
5. Style the floating menu

### Files to Create/Modify
- `src/extensions/SlashCommands.ts` (NEW)
- `src/components/SlashCommandMenu.tsx` (NEW)
- `src/styles/slash-menu.css` (NEW)
- `package.json` (ADD @tippyjs/react, tippy.js)
- `src/components/Editor.tsx` (MODIFY - add extension)

### Implementation Guidance
```typescript
// Menu should show:
// - Function name (from function-utils helper)
// - Description (gray, smaller text)
// - Keyboard hints at bottom

// Use Tippy.js for positioning
// Use suggestion plugin from Tiptap
```

---

## Task 6.5: Enable Inline Slash Commands
**Status**: ✅ Complete   
**Priority**: MEDIUM  
**Complexity**: MODERATE  
**Dependencies**: Task 6  

### Description
Modify slash commands to work inline within existing blocks, not just at the start of new lines. Commands should intelligently handle context - functions insert inline, while block-level commands create new blocks when needed.

### Acceptance Criteria
- [ ] Slash commands work anywhere in text, not just at line start
- [ ] Function badges insert inline correctly
- [ ] Block commands (headings, lists) create new blocks when in middle of text
- [ ] Block commands convert current block when at start of line
- [ ] Maintains existing functionality for start-of-line usage

### Implementation Steps
1. Remove `startOfLine: true` restriction from suggestion config
2. Update heading commands to detect position context
3. Update list commands to handle inline vs block context
4. Update horizontal rule command for context awareness
5. Test inline insertion of functions and block creation

### Files Modified
- `src/extensions/SlashCommands.ts` (MODIFY - remove startOfLine restriction, add context detection)

### Implementation Details
```typescript
// Context detection pattern used:
const { from } = range
const $from = editor.state.doc.resolve(from)
const isAtStartOfBlock = $from.parentOffset === 0

// Conditional behavior:
if (isAtStartOfBlock) {
  // Convert current block
  editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
} else {
  // Create new block
  editor.chain().focus().deleteRange(range).insertContent('\n').setHeading({ level: 1 }).run()
}
```

---

## Completion Checklist
After all tasks complete:
- [ ] All function placeholders render as badges
- [ ] Tooltips show on hover
- [ ] Dropdown allows function changes
- [ ] Delete works with confirmation
- [ ] Markdown serialization preserves formatting
- [ ] Round-trip (markdown → editor → markdown) works
- [ ] Slash commands work (if implemented)
- [ ] No console errors
- [ ] Code is clean and documented