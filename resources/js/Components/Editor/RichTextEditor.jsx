import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
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
import axios from "axios";
import React, { useEffect } from "react";

const buttonBaseClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#141414] text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

function normalizeEditorHtml(editor) {
    if (!editor) return "";
    const html = editor.getHTML();
    const plain = html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

    return plain ? html : "";
}

function extractMentionIdsFromJson(node, out = new Set()) {
    if (!node || typeof node !== "object") return out;
    if (node.type === "mention" && node.attrs?.id != null) {
        const n = Number(node.attrs.id);
        if (Number.isFinite(n)) out.add(n);
    }
    if (Array.isArray(node.content)) {
        node.content.forEach((child) => extractMentionIdsFromJson(child, out));
    }
    return out;
}

function areNumberArraysEqual(a = [], b = []) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function createMentionSuggestionRenderer() {
    let root = null;
    let selected = 0;
    let items = [];
    let command = null;
    let clientRect = null;

    const removeRoot = () => {
        if (root?.parentNode) {
            root.parentNode.removeChild(root);
        }
        root = null;
    };

    const updatePosition = () => {
        if (!root || !clientRect) return;
        const rect = clientRect();
        if (!rect) return;
        root.style.top = `${rect.bottom + 6}px`;
        root.style.left = `${rect.left}px`;
    };

    const renderList = () => {
        if (!root) return;
        root.innerHTML = "";

        if (!items.length) {
            const empty = document.createElement("p");
            empty.className = "px-3 py-2 text-xs text-zinc-500";
            empty.textContent = "No members found";
            root.appendChild(empty);
            return;
        }

        items.forEach((u, idx) => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-mention-idx", String(idx));
            button.className = `flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                idx === selected
                    ? "bg-primary/20 text-zinc-900 dark:text-white"
                    : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10"
            }`;

            const img = document.createElement("img");
            img.alt = "";
            img.src = u?.avatar || "";
            img.className = "h-7 w-7 rounded-full object-cover shrink-0";

            const text = document.createElement("span");
            text.className = "truncate font-medium";
            text.textContent = u?.label || "";

            button.appendChild(img);
            button.appendChild(text);
            root.appendChild(button);
        });
    };

    const onClick = (e) => {
        const button = e.target.closest("[data-mention-idx]");
        if (!button) return;
        const idx = Number(button.getAttribute("data-mention-idx"));
        const user = items[idx];
        if (user && command) {
            command({ id: user.id, label: user.label });
        }
    };

    return {
        onStart: (props) => {
            items = props.items || [];
            selected = 0;
            command = props.command;
            clientRect = props.clientRect;

            root = document.createElement("div");
            root.className =
                "fixed z-[300] max-h-48 w-[min(100vw-2rem,280px)] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl shadow-zinc-900/10 dark:border-white/15 dark:bg-zinc-900 dark:shadow-2xl dark:shadow-black/60";
            root.addEventListener("mousedown", (e) => e.preventDefault());
            root.addEventListener("click", onClick);
            document.body.appendChild(root);
            updatePosition();
            renderList();
        },
        onUpdate: (props) => {
            items = props.items || [];
            selected = 0;
            command = props.command;
            clientRect = props.clientRect;
            updatePosition();
            renderList();
        },
        onKeyDown: (props) => {
            if (!items.length) return false;
            if (props.event.key === "ArrowDown") {
                selected = Math.min(selected + 1, items.length - 1);
                renderList();
                return true;
            }
            if (props.event.key === "ArrowUp") {
                selected = Math.max(selected - 1, 0);
                renderList();
                return true;
            }
            if (props.event.key === "Enter" || props.event.key === "Tab") {
                const user = items[selected];
                if (user && command) {
                    command({ id: user.id, label: user.label });
                    return true;
                }
            }
            if (props.event.key === "Escape") {
                removeRoot();
                return true;
            }
            return false;
        },
        onExit: () => {
            removeRoot();
            items = [];
            command = null;
            clientRect = null;
        },
    };
}

function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    ariaLabel,
    icon,
}) {
    const handleMouseDown = (event) => {
        // Keep current text selection; otherwise click blurs editor before command runs.
        event.preventDefault();
    };

    return (
        <button
            type="button"
            onMouseDown={handleMouseDown}
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
    mentionEnabled = false,
    mentionSuggestionsRoute = null,
    onMentionIdsChange,
    autofocus = false,
}) => {
    const mentionIdsRef = React.useRef([]);
    const mentionRenderer = React.useMemo(
        () => createMentionSuggestionRenderer(),
        []
    );

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
            ...(mentionEnabled
                ? [
                      Mention.configure({
                          HTMLAttributes: {
                              class: "comment-mention-link",
                          },
                          renderText: ({ node }) =>
                              `@${node.attrs.label ?? node.attrs.id}`,
                          renderHTML: ({ node }) => [
                              "span",
                              {
                                  "data-mention-id": String(node.attrs.id),
                                  class: "comment-mention-link",
                              },
                              `@${node.attrs.label ?? node.attrs.id}`,
                          ],
                          suggestion: {
                              char: "@",
                              items: async ({ query }) => {
                                  if (!mentionSuggestionsRoute) return [];
                                  try {
                                      const res = await axios.get(
                                          mentionSuggestionsRoute,
                                          {
                                              params: { q: query || "" },
                                          }
                                      );
                                      return (res?.data?.users || []).map(
                                          (u) => ({
                                              id: u.id,
                                              label: u.name,
                                              avatar:
                                                  u.profile_picture ||
                                                  "https://ui-avatars.com/api/?name=User&background=3f3f46&color=fafafa&size=64",
                                          })
                                      );
                                  } catch {
                                      return [];
                                  }
                              },
                              render: () => mentionRenderer,
                          },
                      }),
                  ]
                : []),
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
            if (
                mentionEnabled &&
                typeof onMentionIdsChange === "function"
            ) {
                const ids = Array.from(
                    extractMentionIdsFromJson(currentEditor.getJSON())
                );
                if (areNumberArraysEqual(mentionIdsRef.current, ids)) return;
                mentionIdsRef.current = ids;
                onMentionIdsChange(ids);
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

    useEffect(() => {
        if (!editor || !mentionEnabled || typeof onMentionIdsChange !== "function") {
            return;
        }
        const ids = Array.from(extractMentionIdsFromJson(editor.getJSON()));
        if (areNumberArraysEqual(mentionIdsRef.current, ids)) return;
        mentionIdsRef.current = ids;
        onMentionIdsChange(ids);
    }, [editor, mentionEnabled, onMentionIdsChange]);

    useEffect(() => {
        if (!editor || !autofocus) return;
        editor.commands.focus("end");
    }, [editor, autofocus]);

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
        <div className={`tiptap-editor relative ${className}`.trim()}>
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
