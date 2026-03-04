import { useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { Eta } from "eta";
import { Button } from "./components/ui/button";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useTheme } from "./components/ui/theme-provider";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Monitor, Moon, Sun } from "lucide-react";

const templateAtom = atomWithStorage<string>(
  "template",
  "<style>\r\n    /* Optional print settings */\r\n    @page {\r\n        size: A4 portrait;\r\n        margin: 20mm;\r\n    }\r\n</style>\r\n\r\nHello, <%= it.name %>!",
);
const dataAtom = atomWithStorage<string>("data", 'return { name: "World" }');

const eta = new Eta();

const printHtmlToPdf = (html: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow!.document;
  doc.open();
  doc.writeln(html);
  doc.close();

  iframe.contentWindow!.focus();
  iframe.contentWindow!.print();

  // Optional cleanup
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
};

export function App() {
  const { theme, actualTheme, setTheme } = useTheme();
  const editorTheme = actualTheme === "dark" ? "vs-dark" : "light";
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [template, setTemplate] = useAtom<string>(templateAtom);
  const [data, setData] = useAtom<string>(dataAtom);

  useEffect(() => {
    if (!frameRef.current) return;
    const update = async () => {
      try {
        const it = new Function(data)();
        const html = eta.renderString(template, it);
        frameRef.current!.srcdoc = html ?? "";
      } catch (e) {
        frameRef.current!.srcdoc = `<pre style="color:red">${(e as Error).message}</pre>`;
      }
    };
    update();
  }, [frameRef, template, data]);

  const handlePrint = () => {
    if (!frameRef.current) return;
    const html = frameRef.current.srcdoc;
    printHtmlToPdf(html ?? "");
  };

  const handleGitHubClick = () => {
    window.open("https://github.com/mikl0906/eta-editor", "_blank");
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="shrink-0 border-b px-4 py-2 flex justify-between items-center gap-4">
        <h1 className="text-lg font-bold tracking-tight">
          Eta template editor
        </h1>
        <div className="flex items-center gap-2">
          <a
            href="https://eta.js.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            Eta docs
          </a>
          <ToggleGroup
            type="single"
            variant="outline"
            value={theme}
            onValueChange={(v) => {
              if (v !== "light" && v !== "dark" && v !== "system") return;
              setTheme(v);
            }}
          >
            <ToggleGroupItem
              value="light"
              size="sm"
              aria-label="Toggle light theme"
              title="Light theme"
            >
              <Sun />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="dark"
              size="sm"
              aria-label="Toggle dark theme"
              title="Dark theme"
            >
              <Moon />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="system"
              size="sm"
              aria-label="Toggle system theme"
              title="System theme"
            >
              <Monitor />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button size="sm" variant="outline" onClick={handleGitHubClick}>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill="currentColor"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Button>
        </div>
      </header>
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-h-0">
        <ResizablePanel>
          <ResizablePanelGroup orientation="vertical" className="h-full">
            <ResizablePanel>
              <div className="h-full flex flex-col overflow-hidden">
                <div className="shrink-0 border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Template
                </div>
                <div className="flex-1 min-h-0">
                  <Editor
                    defaultLanguage="html"
                    value={template}
                    onChange={(v) => setTemplate(v ?? "")}
                    theme={editorTheme}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="h-full flex flex-col overflow-hidden">
                <div className="shrink-0 border-b px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data
                </div>
                <div className="flex-1 min-h-0">
                  <Editor
                    defaultLanguage="javascript"
                    value={data}
                    onChange={(v) => setData(v ?? "")}
                    theme={editorTheme}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                    }}
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="h-full flex flex-col overflow-hidden">
            <div className="shrink-0 border-b px-3 py-2 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preview
              </span>
              <Button size="xs" variant="outline" onClick={handlePrint}>
                Print
              </Button>
            </div>
            <iframe ref={frameRef} className="bg-white flex-1 w-full"></iframe>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
