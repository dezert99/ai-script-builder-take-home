import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { SlashCommandItem } from '@/extensions/SlashCommands'

interface SlashCommandMenuProps {
  items: SlashCommandItem[]
  command: (item: SlashCommandItem) => void
}

export interface SlashCommandMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

export const SlashCommandMenu = forwardRef<SlashCommandMenuRef, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    const selectItem = (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    }

    const upHandler = () => {
      setSelectedIndex((selectedIndex + items.length - 1) % items.length)
    }

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % items.length)
    }

    const enterHandler = () => {
      selectItem(selectedIndex)
    }

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          upHandler()
          return true
        }

        if (event.key === 'ArrowDown') {
          downHandler()
          return true
        }

        if (event.key === 'Enter') {
          enterHandler()
          return true
        }

        return false
      },
    }), [selectedIndex, items, command])

    if (items.length === 0) {
      return (
        <div className="slash-menu">
          <div className="slash-menu-item disabled">
            No results found
          </div>
        </div>
      )
    }

    return (
      <div className="slash-menu">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => selectItem(index)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            <div className="slash-menu-icon">
              {item.icon}
            </div>
            <div className="slash-menu-content">
              <div className="slash-menu-title">
                {item.name}
              </div>
              <div className="slash-menu-description">
                {item.description}
              </div>
            </div>
          </button>
        ))}
        <div className="slash-menu-footer">
          <div className="slash-menu-hint">
            ↑↓ to navigate • ↵ to select • esc to dismiss
          </div>
        </div>
      </div>
    )
  }
)