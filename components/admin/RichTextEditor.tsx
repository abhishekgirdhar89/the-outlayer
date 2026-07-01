"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";

/**
 * Visual (WYSIWYG) editor for article content. Outputs the same HTML the public
 * article renderer expects (<p>, <p class="intro">, <h2>, <ul>, <blockquote class="pq">…),
 * so the table-of-contents and article styling keep working. The editing surface
 * reuses the `.d-prose` styles so it looks like the published page while writing.
 */

// Lead paragraph with a drop cap — adds class="intro" to a <p>.
const IntroParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      intro: {
        default: false,
        parseHTML: (el) => (el as HTMLElement).classList?.contains("intro") ?? false,
        renderHTML: (attrs) => (attrs.intro ? { class: "intro" } : {}),
      },
    };
  },
});

// Pull quote — renders <blockquote class="pq"> and also reads legacy <div class="pq">.
const PullQuote = Blockquote.extend({
  parseHTML() {
    return [{ tag: "blockquote" }, { tag: "div.pq" }];
  },
  renderHTML() {
    return ["blockquote", { class: "pq" }, 0];
  },
});

function ToolButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rte-btn${active ? " is-active" : ""}`}
      title={title}
      aria-label={title}
      onMouseDown={(e) => e.preventDefault()} // keep editor selection
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = (editor.getAttributes("link").href as string) || "";
    const url = window.prompt("Link URL (leave empty to remove):", prev);
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const toggleIntro = () => {
    const active = editor.isActive("paragraph", { intro: true });
    editor.chain().focus().setParagraph().updateAttributes("paragraph", { intro: !active }).run();
  };

  return (
    <div className="rte-toolbar">
      <ToolButton title="Paragraph" active={editor.isActive("paragraph", { intro: false })} onClick={() => editor.chain().focus().setParagraph().run()}>
        ¶
      </ToolButton>
      <ToolButton title="Intro / lead paragraph (drop cap)" active={editor.isActive("paragraph", { intro: true })} onClick={toggleIntro}>
        Intro
      </ToolButton>
      <span className="rte-sep" />
      <ToolButton title="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolButton>
      <ToolButton title="Sub-heading" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolButton>
      <span className="rte-sep" />
      <ToolButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolButton>
      <ToolButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolButton>
      <ToolButton title="Link" active={editor.isActive("link")} onClick={setLink}>
        🔗
      </ToolButton>
      <span className="rte-sep" />
      <ToolButton title="Bulleted list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • List
      </ToolButton>
      <ToolButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </ToolButton>
      <ToolButton title="Pull quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝ Quote
      </ToolButton>
    </div>
  );
}

export function RichTextEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    immediatelyRender: false, // required for SSR in the App Router
    extensions: [
      StarterKit.configure({
        paragraph: false,
        blockquote: false,
        codeBlock: false,
        heading: { levels: [2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener nofollow", target: "_blank" } },
      }),
      IntroParagraph,
      PullQuote,
    ],
    content: defaultValue || "<p></p>",
    editorProps: { attributes: { class: "d-prose rte-content" } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="rte">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      {/* The server action reads this hidden input as `content`. */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
