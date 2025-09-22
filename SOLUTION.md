# AI Script Builder - Solution Documentation

## Overview

This project implements a visual editor for creating AI prompts with embedded function calls. The editor allows non-technical users to create prompts with interactive function badges while producing clean markdown output that LLMs can understand.

## Running the Project Locally

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Technology Stack & Architecture Decisions

### Editor Framework: TipTap

I chose to continue using **TipTap** as the editor framework after evaluating alternatives:

**Considered Alternative:** Draft.js
- I had some familiarity with Draft.js from a previous project
- After comparing TipTap and Draft.js, I decided TipTap was the better choice

**Why TipTap:**
- **Better markdown support** - Critical for this use case since the output needs to be markdown
- **Already set up in the repo** - Reduced setup overhead
- **Rich extension ecosystem** - Made custom features like function badges and slash commands easier to implement
- **Active development and community support**

### UI Components: Radix UI

For pop-ups and interactive components, I used **Radix UI** components rather than adding external libraries:

**Considered Alternative:** Tippy.js
- I've used Tippy in other projects and really like its interfaces
- Initially considered it for the slash command popup

**Why Radix UI:**
- **Already in the repo** - No need to add another package
- **Worked plenty fine** - Met all the requirements for dropdowns, dialogs, and tooltips
- **Consistent with existing design system** - Better integration with the overall UI
- **Accessibility built-in** - Radix provides excellent a11y support out of the box

**Components Used:**
- Function badge dropdowns
- Delete confirmation dialogs  
- Export dropdown menu
- Tooltips for function descriptions
- Slash command menu positioning

### Other Key Architecture Decisions

**Custom Node Implementation:**
- Used TipTap's `ReactNodeViewRenderer` for function badges
- Chose atomic inline nodes to prevent editing of function placeholders

**Slash Commands:**
- Initially tried tippy.js for positioning but switched to pure React for better integration
- Used TipTap's suggestion plugin as the foundation
- Implemented both formatting commands and function insertion

**Markdown Serialization:**
- Implemented round-trip conversion (markdown → editor → markdown)
- Custom serializer to handle function placeholder syntax

**State Management:**
- Kept state management simple with React hooks
- Managed tooltip and dropdown visibility to prevent conflicts
- Used controlled components for better UX

## Features Implemented

### ✅ Core Functionality
- Interactive function badges with tooltips and dropdowns
- Markdown parsing and serialization with function placeholders
- Export functionality (copy to clipboard + file download)
- Rich text formatting toolbar
- Slash commands for quick insertion

### ✅ User Experience Enhancements
- Inline slash commands (work anywhere in text, not just line start)
- Keyboard navigation in slash command menu
- Scroll-to-view for long command lists
- Focus management for seamless editing flow
- Context-aware command behavior (inline vs block-level)

### ✅ Polish & Quality
- Responsive design
- Accessibility through Radix components

## What's Working

Everything implemented is fully functional:
- Function badge creation, editing, and deletion
- Markdown import/export with proper serialization
- Slash commands with filtering and keyboard navigation
- Formatting toolbar with real-time state updates
- Export options with copy and download functionality
- All tooltip and dropdown interactions

## Improvements With More Time

If I had more time to work on this project, I would add several quality of life features:

### Save & Manage Scripts
- **Save queries/sets of instructions** - Allow users to save their prompt templates
- **Navigate through saved instructions** - Simple management interface for saved prompts
- Depending on how this tool is meant to be used, this could greatly improve workflow efficiency

### Function Management
- **Function configuration interface** - Ability to configure additional functions easily within the tool
- Dynamic function loading rather than hardcoded function specs
- Function categorization and search

### Integration & Export
- **Direct system integration** - Depending on the broader use of this tool, add the ability to export files or sets of instructions directly to whatever system is utilizing them
- API integration for saving/loading from external systems
- Bulk export options

### Template System
- **Workflow templates** - For different kinds of common workflows
- **Pre-filled templates** - Users could select a template and it would populate with everything needed for that workflow type
- **Template customization** - Go in and fill in specific instructions or function calls after selecting a template
- This would be particularly helpful for users who are building similar types of prompts repeatedly

### Additional Polish
- Version hsitory for prompts
- Collaborative editing support
- Advanced search and replace
- Function usage analytics
- Dark mode support

## Technical Highlights

- **Custom TipTap extensions** for function badges and slash commands
- **Markdown parsing** that handles complex formatting while preserving function placeholders
- **Context-aware slash commands** that behave differently based on cursor position
- **Proper React component lifecycle management** for complex UI interactions
- **Type-safe TypeScript implementation** throughout the codebase
