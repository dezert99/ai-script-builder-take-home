import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion'
import { ReactRenderer } from '@tiptap/react'
import { SlashCommandMenu } from '@/components/SlashCommandMenu'
import { functionSpecs } from '@/data'

export interface SlashCommandItem {
  id: string
  name: string
  description: string
  icon?: string
  command: ({ editor, range }: { editor: any; range: any }) => void
}

const slashCommandItems: SlashCommandItem[] = [
  // Function commands
  ...functionSpecs.map(spec => ({
    id: `function-${spec.id}`,
    name: spec.description.split(' - ')[0] || spec.description, // Extract name part
    description: spec.description,
    icon: '⚡',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'functionBadge',
          attrs: {
            functionId: spec.id
          }
        })
        .run()
    }
  })),
  // Formatting commands
  {
    id: 'heading1',
    name: 'Heading 1',
    description: 'Large heading',
    icon: 'H1',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 1 })
        .run()
    }
  },
  {
    id: 'heading2',
    name: 'Heading 2',
    description: 'Medium heading',
    icon: 'H2',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 2 })
        .run()
    }
  },
  {
    id: 'heading3',
    name: 'Heading 3',
    description: 'Small heading',
    icon: 'H3',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 3 })
        .run()
    }
  },
  {
    id: 'bulletList',
    name: 'Bullet List',
    description: 'Create a bullet list',
    icon: '•',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run()
    }
  },
  {
    id: 'numberedList',
    name: 'Numbered List',
    description: 'Create a numbered list',
    icon: '1.',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run()
    }
  },
  {
    id: 'horizontalRule',
    name: 'Horizontal Rule',
    description: 'Add a horizontal divider',
    icon: '―',
    command: ({ editor, range }: { editor: any; range: any }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .run()
    }
  }
]

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: true,
        command: ({ editor, range, props }: { editor: any; range: any; props: SlashCommandItem }) => {
          props.command({ editor, range })
        }
      } as Partial<SuggestionOptions>
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: new PluginKey('slashCommands'),
        
        items: ({ query }: { query: string }) => {
          return slashCommandItems
            .filter(item => 
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10) // Limit to 10 items for performance
        },

        render: () => {
          let component: ReactRenderer
          let popup: HTMLElement

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandMenu, {
                props,
                editor: this.editor,
              })

              popup = document.createElement('div')
              popup.style.position = 'absolute'
              popup.style.zIndex = '50'
              popup.style.top = '0px'
              popup.style.left = '0px'
              popup.style.transform = 'translateY(8px)'
              popup.appendChild(component.element)
              document.body.appendChild(popup)

              if (props.clientRect) {
                const rect = props.clientRect()
                popup.style.left = `${rect.left}px`
                popup.style.top = `${rect.bottom}px`
              }
            },

            onUpdate(props: any) {
              component.updateProps(props)

              if (props.clientRect) {
                const rect = props.clientRect()
                popup.style.left = `${rect.left}px`
                popup.style.top = `${rect.bottom}px`
              }
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                return true
              }

              return (component?.ref as any)?.onKeyDown?.(props) || false
            },

            onExit() {
              popup?.remove()
              component?.destroy()
            },
          }
        }
      }),
    ]
  },
})