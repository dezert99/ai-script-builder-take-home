import { useRef } from "react";
import { Header } from "@/components/Header";
import { EditorHeader } from "@/components/EditorHeader";
import { Editor } from "@/components/Editor";

export default function App() {
  const exportFunctionRef = useRef<(() => void) | null>(null);

  const handleExport = (markdown: string) => {
    
    // Copy to clipboard
    navigator.clipboard.writeText(markdown).then(() => {
      console.log('Markdown exported and copied to clipboard:', markdown);
      alert('Markdown exported and copied to clipboard!');
    }).catch(() => {
      console.log('Exported markdown:', markdown);
      alert('Markdown exported! Check console for output.');
    });
  };

  const triggerExport = () => {
    if (exportFunctionRef.current) {
      exportFunctionRef.current();
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
