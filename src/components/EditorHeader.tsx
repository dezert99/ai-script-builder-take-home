import { Button } from "@/components/ui/button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Download, Copy, ChevronDown } from "lucide-react";

interface EditorHeaderProps {
  onExport?: (type: 'copy' | 'download') => void;
}

export function EditorHeader({ onExport }: EditorHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        <h1 className="text-4xl font-bold">Prompt Editor</h1>
        <div className="flex-1 flex justify-end">
          {onExport && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[160px] bg-white rounded-md border border-gray-200 shadow-lg p-1 z-50"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 outline-none flex items-center gap-2"
                    onSelect={() => onExport('copy')}
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 focus:bg-gray-100 outline-none flex items-center gap-2"
                    onSelect={() => onExport('download')}
                  >
                    <Download className="h-4 w-4" />
                    Download as File
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        Create and edit AI prompts with embedded functions. <br /> Use slash
        commands to add new functions.
      </p>
    </div>
  );
}
