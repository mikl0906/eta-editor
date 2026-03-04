import { useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { Eta } from "eta";

const eta = new Eta();

export function App() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [template, setTemplate] = useState<string>("");

  useEffect(() => {
    if (!frameRef.current) return;

    const updateFrame = async () => {
      const html = eta.renderString(template, { model: {} });
      frameRef.current!.srcdoc = html;
    };
    updateFrame();
  }, [frameRef, template]);

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel>
        <Editor
          height="90vh"
          defaultLanguage="html"
          value={template}
          onChange={(v) => setTemplate(v ?? "")}
          theme="vs-dark"
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <iframe ref={frameRef} className="bg-white h-full w-full"></iframe>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
