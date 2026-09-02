"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

function Button({ active, disabled, onClick, children, title }: { active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode; title: string }) {
  return <button type="button" title={title} disabled={disabled} onClick={onClick} className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-ui text-[11px] transition-colors disabled:opacity-40 ${active ? "bg-ink text-sky" : "text-ink-soft hover:bg-night/5 hover:text-ink"}`}>{children}</button>;
}

export default function RichTextEditor({ value, onChange, uploadImage }: { value: string; onChange: (html: string) => void; uploadImage: (file: File) => Promise<string | null> }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Write your story… Use headings, quotes, lists, links, and images to shape the story." }),
      CharacterCount.configure({ limit: 50000 }),
    ],
    content: value || "<p></p>",
    editorProps: { attributes: { class: "prose prose-sm max-w-none min-h-[460px] px-5 py-5 font-body text-[16px] leading-8 text-ink outline-none" } },
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  if (!editor) return <div className="min-h-[540px] rounded-xl border border-line bg-surface" />;

  async function addImage(file?: File) {
    if (!file) return;
    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  }

  function addLink() {
    const current = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", current || "https://");
    if (url === null) return;
    if (!url.trim()) editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url.trim() }).run();
  }

  return <div className="overflow-hidden rounded-xl border border-line bg-surface">
    <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-[#f8f8f6] p-2">
      <Button title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></Button>
      <Button title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></Button>
      <Button title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Button>
      <span className="mx-1 h-5 w-px bg-line/20" />
      <Button title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
      <Button title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>
      <Button title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>“ ”</Button>
      <span className="mx-1 h-5 w-px bg-line/20" />
      <Button title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• list</Button>
      <Button title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. list</Button>
      <Button title="Link" active={editor.isActive("link")} onClick={addLink}>↗</Button>
      <label title="Insert image" className="inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 font-ui text-[11px] text-ink-soft hover:bg-night/5 hover:text-ink">Image<input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { void addImage(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
      <span className="mx-1 h-5 w-px bg-line/20" />
      <Button title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>L</Button>
      <Button title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>C</Button>
      <Button title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>R</Button>
      <span className="mx-1 h-5 w-px bg-line/20" />
      <Button title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↶</Button>
      <Button title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↷</Button>
    </div>
    <EditorContent editor={editor} />
    <div className="flex items-center justify-between border-t border-line px-4 py-2 font-ui text-[10px] text-ink-soft"><span>Rich content · images upload directly to your media storage</span><span>{editor.storage.characterCount.characters()} / 50,000</span></div>
  </div>;
}
