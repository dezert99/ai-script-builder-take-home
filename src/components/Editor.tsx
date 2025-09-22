import { useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FunctionBadge } from "@/extensions/FunctionBadge";
import { SlashCommands } from "@/extensions/SlashCommands";
import { EditorToolbar } from "@/components/EditorToolbar";
import { parseMarkdownWithFunctions } from "@/lib/markdown-parser";
import { serializeToMarkdown } from "@/lib/markdown-serializer";
import { functionSpecs } from "@/data";
import "@/styles/editor.css";
import "@/styles/slash-menu.css";

const SAMPLE_SCRIPT = `# Simple Color Preference Script

## You are assisting a client.

1. Ask: **What is your favorite color?**
2. As soon as the user responds, <% function xyz98765-wxyz-4321-lmno-pqrstuvwxyza %>
3. If the response is **red**, <% function abc12345-def6-7890-ghij-klmnopqrstuv %>
`;

interface EditorProps {
  onExport?: (markdown: string, type: 'copy' | 'download') => void;
  exportRef?: React.MutableRefObject<((type: 'copy' | 'download') => void) | null>;
}

export function Editor({ onExport, exportRef }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FunctionBadge,
      SlashCommands,
      Placeholder.configure({
        placeholder: "Start writing your script... Type '/' for commands",
      }),
    ],
    content: parseMarkdownWithFunctions(SAMPLE_SCRIPT, functionSpecs)
  });

  const handleExport = useCallback((type: 'copy' | 'download' = 'copy') => {
    if (!editor) return;
    
    const markdown = serializeToMarkdown(editor);
    
    if (onExport) {
      onExport(markdown, type);
    } else {
      // Default behavior: copy to clipboard and log
      navigator.clipboard.writeText(markdown).then(() => {
        console.log('Markdown copied to clipboard:', markdown);
      }).catch(() => {
        console.log('Exported markdown:', markdown);
      });
    }
  }, [editor, onExport]);

  // Expose export function via ref
  useEffect(() => {
    if (exportRef) {
      exportRef.current = handleExport;
    }
  }, [exportRef, handleExport]);


  return (
    <Card className="rounded-lg shadow-lg overflow-hidden py-0">
      <EditorToolbar editor={editor} />
      <CardContent className="p-6 pt-0">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
}
