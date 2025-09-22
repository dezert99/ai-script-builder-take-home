import { useEffect, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Minus 
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [, forceUpdate] = useState({})
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!editor) return

    const updateHandler = () => {
      forceUpdate({})
    }

    const focusHandler = () => {
      setIsFocused(true)
    }

    const blurHandler = () => {
      setIsFocused(false)
    }

    editor.on('selectionUpdate', updateHandler)
    editor.on('transaction', updateHandler)
    editor.on('focus', focusHandler)
    editor.on('blur', blurHandler)

    return () => {
      editor.off('selectionUpdate', updateHandler)
      editor.off('transaction', updateHandler)
      editor.off('focus', focusHandler)
      editor.off('blur', blurHandler)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const toolbarButtons = [
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => isFocused && editor.isActive('heading') && editor.getAttributes('heading').level === 1,
    },
    {
      icon: Heading2,
      label: 'Heading 2', 
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => isFocused && editor.isActive('heading') && editor.getAttributes('heading').level === 2,
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => isFocused && editor.isActive('heading') && editor.getAttributes('heading').level === 3,
    },
    {
      icon: Bold,
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => isFocused && editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => isFocused && editor.isActive('italic'),
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => isFocused && editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => isFocused && editor.isActive('orderedList'),
    },
    {
      icon: Minus,
      label: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run(),
      isActive: () => false, // Horizontal rules don't have active state
    },
  ]

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 rounded-t-lg">
      <div className="flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          const IconComponent = button.icon
          const isActive = button.isActive()
          
          return (
            <Button
              key={index}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={button.action}
              className={`h-8 w-8 p-0 ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'hover:bg-gray-200'
              }`}
              title={button.label}
            >
              <IconComponent className="h-4 w-4" />
            </Button>
          )
        })}
      </div>
    </div>
  )
}