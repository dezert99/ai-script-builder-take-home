import { Card, CardContent } from "@/components/ui/card";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FunctionBadge } from "@/extensions/FunctionBadge";
import { parseMarkdownWithFunctions } from "@/lib/markdown-parser";
import { functionSpecs } from "@/data";

const SAMPLE_SCRIPT = `# Simple Color Preference Script

## You are assisting a client.

1. Ask: **What is your favorite color?**
2. As soon as the user responds, <% function xyz98765-wxyz-4321-lmno-pqrstuvwxyza %>
3. If the response is **red**, <% function abc12345-def6-7890-ghij-klmnopqrstuv %>
`;

export function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      FunctionBadge,
      Placeholder.configure({
        placeholder: "Start writing your script...",
      }),
    ],
    content: parseMarkdownWithFunctions(SAMPLE_SCRIPT, functionSpecs),
  });

  return (
    <Card className="rounded-lg shadow-lg">
      <CardContent className="p-6">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
}
