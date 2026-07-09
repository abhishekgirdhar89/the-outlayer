"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import Image from "@tiptap/extension-image";

/**
 * Visual (WYSIWYG) editor for article content. Outputs the same HTML the public
 * article renderer expects (<p>, <p class="intro">, <h2>, <ul>, <blockquote class="pq">,
 * <img>…), so the table-of-contents and article styling keep working. The editing
 * surface reuses the `.d-prose` styles so it looks like the published page while writing.
 * Inline images upload to Supabase storage (via /admin/upload) on click, paste, or drop.
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

/** Upload one image file to the protected admin endpoint; returns its public URL or null. */
async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await fetch("/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Image upload failed.");
      return null;
    }
    return (data.url as string) || null;
  } catch {
    alert("Image upload failed. Please check your connection and try again.");
    return null;
  }
}

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

function Toolbar({ editor, onPickImage }: { editor: Editor; onPickImage: () => void }) {
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
      <ToolButton title="Insert image (or just paste / drag one in)" onClick={onPickImage}>
        🖼
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
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload then insert the image (at an explicit position for drops, else at the cursor).
  const insertImage = async (file: File, at?: number) => {
    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    const ed = editorRef.current;
    if (!url || !ed) return;
    const chain = ed.chain().focus();
    if (typeof at === "number") chain.insertContentAt(at, { type: "image", attrs: { src: url } });
    else chain.setImage({ src: url });
    chain.run();
  };

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
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { loading: "lazy" } }),
    ],
    content: defaultValue || "<p></p>",
    editorProps: {
      attributes: { class: "d-prose rte-content" },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              insertImage(file);
              return true;
            }
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || !files.length) return false;
        const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
        if (!images.length) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        images.forEach((f) => insertImage(f, coords?.pos));
        return true;
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });
  editorRef.current = editor;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div className="rte">
      {editor && <Toolbar editor={editor} onPickImage={() => fileInputRef.current?.click()} />}
      <EditorContent editor={editor} />
      {uploading && <div className="rte-uploading">Uploading image…</div>}
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
      {/* The server action reads this hidden input as `content`. */}
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
