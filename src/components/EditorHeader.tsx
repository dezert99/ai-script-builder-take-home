import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface EditorHeaderProps {
  onExport?: () => void;
}

export function EditorHeader({ onExport }: EditorHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1"></div>
        <h1 className="text-4xl font-bold">Prompt Editor</h1>
        <div className="flex-1 flex justify-end">
          {onExport && (
            <Button 
              onClick={onExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
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
