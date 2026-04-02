"use client";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

interface CodeEditorProps {
  content: string;
  filePath: string;
  onChange: (value: string) => void;
}

function getLanguageExtension(filePath: string) {
  if (/\.(tsx?|jsx?)$/.test(filePath)) {
    const isTS = /\.tsx?$/.test(filePath);
    return javascript({ jsx: true, typescript: isTS });
  }
  if (filePath.endsWith(".css")) return css();
  if (filePath.endsWith(".html")) return html();
  if (/\.(json|toml)$/.test(filePath)) return json();
  return javascript();
}

export function CodeEditor({ content, filePath, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={content}
      height="100%"
      theme={oneDark}
      extensions={[getLanguageExtension(filePath)]}
      onChange={onChange}
      className="h-full overflow-auto text-sm scrollbar-black"
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        foldGutter: true,
        bracketMatching: true,
        autocompletion: true,
        indentOnInput: true,
      }}
    />
  );
}
