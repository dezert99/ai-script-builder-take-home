# AI Script Builder - Claude Code Documentation

## 🎯 Project Overview

This is a **prompt building tool** for non-technical users who need to create AI prompts with embedded functions. The tool provides a visual editor that produces markdown output suitable for LLMs.

### Core Challenge
- **LLMs need markdown** with `<% function UUID %>` placeholders
- **Users need visual editing** without seeing markdown syntax
- **Solution**: Rich visual editor that serializes to/from markdown

## 📋 Task Management Protocol

### Your Workflow
1. **Start a task**: Mark it as `🟡 In Progress` in tasks.md
2. **Complete implementation**: Mark as `🔵 Pending Review`
3. **After user review**: Mark as `✅ Complete` (only when user approves)
4. **Provide commit message** after marking complete
5. **STOP and WAIT** for user to approve before starting next task

### Task Status Markers
- `🔴 Not Started` - Haven't begun
- `🟡 In Progress` - Currently working
- `🔵 Pending Review` - Implementation complete, awaiting review
- `✅ Complete` - Reviewed and approved

### Commit Message Format
After completing a task and receiving approval, provide:
```
Title: feat: [Brief description]

Body:
- What was implemented
- Key technical decisions
- Files changed
- Any notable considerations
```

## 🏗️ Technical Architecture

### Tech Stack
- **Editor**: Tiptap (ProseMirror-based)
- **UI**: React + Radix UI + Tailwind CSS
- **Build**: Vite
- **Language**: TypeScript

### Why Tiptap?
- Built-in markdown support (critical requirement)
- Extensible via custom nodes
- Active development and community
- Clean React integration

### Project Structure
```
src/
├── components/         # React components
│   ├── Editor.tsx     # Main editor component
│   ├── EditorHeader.tsx
│   ├── Header.tsx
│   └── ui/            # Radix UI components
├── data/              # Data models and mock data
│   └── index.ts       # FunctionSpec definitions
├── extensions/        # Tiptap extensions (TO CREATE)
├── lib/              # Utilities (TO CREATE)
└── styles/           # Additional CSS (TO CREATE)
```

### Path Aliases
- `@/` maps to `./src/` directory

## 📊 Data Model

### FunctionSpec (from src/data/index.ts)
```typescript
interface FunctionSpec {
  id: string;                    // Unique UUID
  description: string;           // Human-readable description
  function_internal_id: string;  // Maps to availableFunctions
}
```

### Available Functions
- `Functions.EndConversation`
- `Functions.TransferCall`
- `Functions.Knowledge`
- `Functions.Calendar`

## 🎮 Feature Requirements

### 1. Function Badges (Core Feature)
- Replace `<% function UUID %>` with interactive badges
- Show tooltip with description on hover
- Click opens dropdown to change function
- Delete with confirmation dialog

### 2. Markdown Support
- Parse markdown including:
  - Headings, bold, italic, underline
  - Lists, horizontal rules
  - Inline code/blocks
- Preserve ALL formatting in round-trip conversion

### 3. Serialization
- Convert visual editor → markdown for LLM
- Function badges → `<% function UUID %>` placeholders
- Maintain document structure

### 4. Slash Commands (Stretch Goal)
- Type `/` to open command menu
- Show functions with name + description
- Keyboard navigable
- Filter as you type

## 🔧 Implementation Guidelines

### Custom Node Pattern
```typescript
// Tiptap custom nodes extend Node class
Node.create({
  name: 'nodeName',
  group: 'inline',    // or 'block'
  inline: true,       // for inline nodes
  atom: true,         // atomic = not editable
  
  addAttributes() {
    // Define data attributes
  },
  
  parseHTML() {
    // How to parse from HTML
  },
  
  renderHTML() {
    // How to render to HTML
  },
  
  addNodeView() {
    // Custom React component
    return ReactNodeViewRenderer(Component)
  }
})
```

### Working with Tiptap Editor
```typescript
// Access editor instance
const editor = useEditor({
  extensions: [...],
  content: '...',
})

// Get content
editor.getHTML()      // As HTML
editor.getJSON()      // As JSON
editor.getText()      // Plain text

// Update content
editor.commands.setContent(content)
editor.commands.insertContent(content)

// Transaction
editor.chain()
  .focus()
  .deleteRange(range)
  .insertContent(content)
  .run()
```

### Radix UI Components Available
- Button
- Card
- Dropdown Menu
- Navigation Menu
- (Add more as needed: Tooltip, Dialog, etc.)

## 🚨 Important Considerations

### Function ID Validation
- Always check function ID exists in `functionSpecs`
- Handle invalid IDs gracefully (keep original text or show error)

### Markdown Fidelity
- Round-trip must preserve ALL formatting
- Test: markdown → editor → markdown should match

### Edge Cases
- Invalid function UUIDs
- Malformed placeholder syntax
- Nested formatting with functions
- Copy/paste behavior
- Multiple functions in same paragraph

### Performance
- Parse markdown once on load
- Debounce serialization if needed
- Use React.memo for badge components

## 📝 Development Tips

### Testing Your Implementation
1. Load the sample script - should show badges
2. Hover badges - should show tooltip
3. Click badge - should open dropdown
4. Delete badge - should require confirmation
5. Export - should produce valid markdown
6. Round-trip - import exported markdown

### Common Pitfalls
- Don't forget to validate function IDs
- Ensure atomic nodes aren't editable
- Handle edge cases in regex parsing
- Test keyboard navigation thoroughly
- Check mobile responsiveness

### Useful Tiptap Documentation
- [Custom Extensions](https://tiptap.dev/guide/custom-extensions)
- [Node Views](https://tiptap.dev/guide/node-views/react)
- [Suggestion Plugin](https://tiptap.dev/api/utilities/suggestion)

## 🎯 Success Criteria

The implementation is complete when:
1. ✅ All `<% function UUID %>` render as badges
2. ✅ Badges have working tooltips
3. ✅ Dropdown allows function selection
4. ✅ Delete works with confirmation
5. ✅ Markdown serialization works
6. ✅ Round-trip preserves formatting
7. ✅ No console errors
8. ✅ Clean, documented code

## 🔄 Review Process

When marking a task as `🔵 Pending Review`:
1. Ensure all acceptance criteria are met
2. Test the feature thoroughly
3. Check for console errors
4. Verify no regressions in existing features
5. Provide clear summary of what was implemented
6. Wait for user approval before proceeding

## 📌 Remember

- **STOP after each task** for review
- **Don't auto-commit** - provide message only
- **Focus on one task** at a time
- **Ask questions** if requirements unclear
- **Test thoroughly** before marking complete