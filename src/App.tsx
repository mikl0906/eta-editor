import { Editor } from "@monaco-editor/react";
import { Button } from "./components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";

export function App() {
  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel>
        <Editor
          height="90vh"
          defaultLanguage="html"
          defaultValue="// some comment"
          theme="vs-dark"
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <Button>Hello world</Button>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
