import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    Link2,
    List,
    ListOrdered,
    Redo2,
    Undo2,
    Unlink2,
} from "lucide-react";
import React, { useEffect } from "react";

const buttonBaseClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#141414] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

function normalizeEditorHtml(editor) {
    if (!editor) return "";
    if (!editor.getText().trim()) return "";
    return editor.getHTML();
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    ariaLabel,
    icon,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            title={ariaLabel}
            className={`${buttonBaseClass} ${
                isActive
                    ? "border-primary/50 bg-primary/15 text-primary"
                    : ""
            }`}
        >
            {icon}
        </button>
    );
}

const RichTextEditor = ({
    value = "",
    onChange,
    label,
    placeholder = "Write here...",
    error,
    className = "",
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                protocols: ["http", "https", "mailto"],
            }),
            Highlight,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value || "",
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-sm min-h-[180px] max-w-none rounded-b-xl border border-t-0 border-white/10 bg-[#101010] px-3 py-2.5 text-sm text-white outline-none",
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            if (typeof onChange === "function") {
                onChange(normalizeEditorHtml(currentEditor));
            }
        },
    });

    useEffect(() => {
        if (!editor) return;
        const incoming = value || "";
        const current = normalizeEditorHtml(editor);
        if (incoming === current) return;

        editor.commands.setContent(incoming, { emitUpdate: false });
    }, [editor, value]);

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("Enter URL", previousUrl);

        if (url === null) return;
        const trimmed = url.trim();
        if (trimmed === "") {
            editor.chain().focus().unsetLink().run();
            return;
        }
        editor.chain().focus().setLink({ href: trimmed }).run();
    };

    return (
        <div className={`relative ${className}`.trim()}>
            {label ? (
                <InputLabel
                    value={label}
                    className="!mb-2 !text-zinc-400"
                />
            ) : null}

            <div className="overflow-hidden rounded-xl">
                <div className="flex flex-wrap gap-1.5 rounded-t-xl border border-white/10 bg-[#161616] p-2">
                    <ToolbarButton
                        ariaLabel="Heading 1"
                        icon={<Heading1 size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                        isActive={editor?.isActive("heading", { level: 1 })}
                    />
                    <ToolbarButton
                        ariaLabel="Heading 2"
                        icon={<Heading2 size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                        isActive={editor?.isActive("heading", { level: 2 })}
                    />
                    <ToolbarButton
                        ariaLabel="Heading 3"
                        icon={<Heading3 size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                        isActive={editor?.isActive("heading", { level: 3 })}
                    />
                    <ToolbarButton
                        ariaLabel="Bold"
                        icon={<Bold size={16} />}
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        isActive={editor?.isActive("bold")}
                    />
                    <ToolbarButton
                        ariaLabel="Italic"
                        icon={<Italic size={16} />}
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        isActive={editor?.isActive("italic")}
                    />
                    <ToolbarButton
                        ariaLabel="Bullet List"
                        icon={<List size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleBulletList().run()
                        }
                        isActive={editor?.isActive("bulletList")}
                    />
                    <ToolbarButton
                        ariaLabel="Numbered List"
                        icon={<ListOrdered size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleOrderedList().run()
                        }
                        isActive={editor?.isActive("orderedList")}
                    />
                    <ToolbarButton
                        ariaLabel="Add Link"
                        icon={<Link2 size={16} />}
                        onClick={setLink}
                        isActive={editor?.isActive("link")}
                    />
                    <ToolbarButton
                        ariaLabel="Remove Link"
                        icon={<Unlink2 size={16} />}
                        onClick={() => editor?.chain().focus().unsetLink().run()}
                        disabled={!editor?.isActive("link")}
                    />
                    <ToolbarButton
                        ariaLabel="Highlight"
                        icon={<Highlighter size={16} />}
                        onClick={() =>
                            editor?.chain().focus().toggleHighlight().run()
                        }
                        isActive={editor?.isActive("highlight")}
                    />
                    <ToolbarButton
                        ariaLabel="Undo"
                        icon={<Undo2 size={16} />}
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={!editor?.can().undo()}
                    />
                    <ToolbarButton
                        ariaLabel="Redo"
                        icon={<Redo2 size={16} />}
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={!editor?.can().redo()}
                    />
                </div>
                <EditorContent editor={editor} />
            </div>

            <InputError message={error} inline />
        </div>
    );
};

export default RichTextEditor;
