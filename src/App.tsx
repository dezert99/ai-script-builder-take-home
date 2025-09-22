import { useRef } from "react";
import { Header } from "@/components/Header";
import { EditorHeader } from "@/components/EditorHeader";
import { Editor } from "@/components/Editor";

export default function App() {
  const exportFunctionRef = useRef<(() => void) | null>(null);

  const downloadMarkdown = (content: string, filename = 'script.md') => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // Successfully copied to clipboard
    }).catch((error) => {
      console.error('Failed to copy to clipboard:', error);
      console.log('Markdown content:', content);
    });
  };

  const handleExport = (markdown: string, type: 'copy' | 'download') => {
    if (type === 'copy') {
      copyToClipboard(markdown);
    } else if (type === 'download') {
      downloadMarkdown(markdown);
    }
  };

  const triggerExport = (type: 'copy' | 'download') => {
    if (exportFunctionRef.current) {
      // We need to modify the export function to pass the type
      (exportFunctionRef.current as any)(type);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <Header />

      {/* Editor Section */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <EditorHeader onExport={triggerExport} />
          <Editor 
            onExport={handleExport} 
            exportRef={exportFunctionRef}
          />
        </div>
      </section>
    </div>
  );
}
