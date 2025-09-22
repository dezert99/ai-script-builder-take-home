import { useState } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import type { ReactNodeViewProps } from '@tiptap/react'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { getFunctionSpec, getFunctionDisplayName, getAllFunctionSpecs } from '@/lib/function-utils'
import { Trash2, ChevronDown, X } from 'lucide-react'

export function FunctionBadgeComponent({ node, updateAttributes, deleteNode, editor }: ReactNodeViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { functionId } = node.attrs
  
  const currentSpec = getFunctionSpec(functionId)
  const allSpecs = getAllFunctionSpecs()
  
  if (!currentSpec) {
    return (
      <NodeViewWrapper className="inline-block">
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm border border-red-300">
          Invalid Function
        </span>
      </NodeViewWrapper>
    )
  }

  const handleFunctionChange = (newFunctionId: string) => {
    updateAttributes({ functionId: newFunctionId })
    setIsDropdownOpen(false)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(false)
    deleteNode()
    // Focus editor after deletion
    setTimeout(() => {
      editor?.commands.focus()
    }, 0)
  }


  return (
    <NodeViewWrapper className="inline-block">
      <div className="inline-flex items-center">
        <Tooltip.Provider>
          <Tooltip.Root open={isDropdownOpen ? false : undefined}>
            <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <Tooltip.Trigger asChild>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 py-1 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 rounded-md text-sm font-medium inline-flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    {getFunctionDisplayName(currentSpec)}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenu.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg z-50 max-w-xs"
                  side="top"
                  sideOffset={5}
                >
                  {currentSpec.description}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-white rounded-md border border-gray-200 shadow-lg p-1 z-50"
              align="start"
              onCloseAutoFocus={(e) => {
                e.preventDefault()
                // Simple focus restoration without position interference
                editor?.commands.focus()
              }}
            >
              <DropdownMenu.Label className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Select Function
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              {allSpecs.map((spec) => (
                <DropdownMenu.Item
                  key={spec.id}
                  className="px-2 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 outline-none"
                  onSelect={() => handleFunctionChange(spec.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {getFunctionDisplayName(spec)}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {spec.description}
                    </span>
                  </div>
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
              <DropdownMenu.Item
                className="px-2 py-2 text-sm rounded cursor-pointer hover:bg-red-50 focus:bg-red-50 outline-none text-red-600"
                onSelect={() => {
                  setIsDeleteDialogOpen(true)
                  setIsDropdownOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="h-3 w-3" />
                  Delete Function
                </div>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
            </Tooltip.Root>
          </Tooltip.Provider>
      </div>

      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
              Delete Function
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this function? This action cannot be undone.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </NodeViewWrapper>
  )
}