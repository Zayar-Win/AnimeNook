import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import ReactQuill from "react-quill";
import { useForm } from "@inertiajs/react";
import { useDebounce } from "@uidotdev/usehooks";
import { createPortal } from "react-dom";
import axios from "axios";
import Button from "./Button";

function getMentionContext(editor) {
    const sel = editor.getSelection(true);
    if (!sel) return null;
    const cursor = sel.index;
    const text = editor.getText(0, cursor);
    const lastAt = text.lastIndexOf("@");
    if (lastAt === -1) return null;
    const afterAt = text.slice(lastAt + 1);
    if (/\s/.test(afterAt)) return null;
    if (lastAt > 0 && /\S/.test(text[lastAt - 1])) return null;
    return {
        startIndex: lastAt,
        query: afterAt,
        cursor,
    };
}

const CommentForm = ({
    manga,
    anime,
    comment,
    focus,
    type = "create",
    onSuccess = () => {},
    className = "",
}) => {
    const { data, setData, post, errors, reset } = useForm({
        comment: comment && type === "update" ? comment.body : "",
        mangaId: manga?.id,
        animeId: anime?.id,
        commentId:
            type === "reply" || type === "update" ? comment?.id : undefined,
        mentioned_user_ids: [],
    });

    const quillRef = useRef();
    /** Last known @mention range while menu is open — selection is lost when clicking the portal. */
    const activeMentionRef = useRef(null);
    const mentionedIdsRef = useRef(data.mentioned_user_ids);
    const [mentionOpen, setMentionOpen] = useState(false);
    const [mentionCoords, setMentionCoords] = useState({
        top: 0,
        left: 0,
    });
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionHits, setMentionHits] = useState([]);
    const [mentionLoading, setMentionLoading] = useState(false);
    const [selectedMentionIdx, setSelectedMentionIdx] = useState(0);
    const [mentionChips, setMentionChips] = useState([]);
    const debouncedMentionQuery = useDebounce(mentionQuery, 200);

    useEffect(() => {
        mentionedIdsRef.current = data.mentioned_user_ids;
    }, [data.mentioned_user_ids]);

    const getEditor = () =>
        quillRef.current?.getEditor?.() || quillRef.current?.editor;

    /**
     * Quill getBounds() is relative to editor.container (not .ql-editor).
     * It often returns null right after typing @ (empty text node) until layout runs.
     */
    const updateMentionPosition = useCallback((editor, cursorIndex) => {
        const container = editor.container;
        if (!container) return;

        const fromQuill = () => {
            const b = editor.getBounds(cursorIndex);
            if (!b) return null;
            const cr = container.getBoundingClientRect();
            return {
                top: cr.top + b.top + b.height + 4,
                left: cr.left + b.left,
            };
        };

        const fromNativeSelection = () => {
            const sel = window.getSelection();
            if (!sel?.rangeCount || !editor.root.contains(sel.anchorNode)) {
                return null;
            }
            const range = sel.getRangeAt(0);
            let r = range.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) {
                const rects = range.getClientRects();
                if (rects.length > 0) {
                    r = rects[rects.length - 1];
                }
            }
            if (r.width === 0 && r.height === 0) return null;
            return { top: r.bottom + 4, left: r.left };
        };

        const coords = fromQuill() || fromNativeSelection();
        if (coords) {
            setMentionCoords(coords);
            return true;
        }
        return false;
    }, []);

    const scheduleMentionPosition = useCallback(
        (editor, cursorIndex) => {
            let attempts = 0;
            const maxAttempts = 8;
            const tick = () => {
                const ok = updateMentionPosition(editor, cursorIndex);
                if (ok) return;
                if (
                    attempts < maxAttempts &&
                    getMentionContext(editor) !== null
                ) {
                    attempts += 1;
                    requestAnimationFrame(tick);
                }
            };
            requestAnimationFrame(() => requestAnimationFrame(tick));
        },
        [updateMentionPosition],
    );

    const syncMentionFromEditor = useCallback(
        (editor) => {
            if (type !== "create" && type !== "reply") {
                activeMentionRef.current = null;
                setMentionOpen(false);
                return;
            }
            const ctx = getMentionContext(editor);
            if (!ctx) {
                activeMentionRef.current = null;
                setMentionOpen(false);
                return;
            }
            activeMentionRef.current = {
                startIndex: ctx.startIndex,
                cursor: ctx.cursor,
            };
            setMentionQuery(ctx.query);
            setMentionOpen(true);
            setSelectedMentionIdx(0);
            scheduleMentionPosition(editor, ctx.cursor);
        },
        [type, scheduleMentionPosition],
    );

    useEffect(() => {
        if (!mentionOpen || (type !== "create" && type !== "reply")) {
            setMentionHits([]);
            return;
        }
        let cancelled = false;
        setMentionLoading(true);
        axios
            .get(
                window.route("group.users.mention-suggestions", {
                    q: debouncedMentionQuery,
                }),
            )
            .then((res) => {
                if (!cancelled) {
                    setMentionHits(res.data.users || []);
                }
            })
            .catch(() => {
                if (!cancelled) setMentionHits([]);
            })
            .finally(() => {
                if (!cancelled) setMentionLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [debouncedMentionQuery, mentionOpen, type]);

    useEffect(() => {
        setSelectedMentionIdx(0);
    }, [mentionHits]);

    const resolveMentionRange = useCallback((editor) => {
        const docLen = editor.getLength();
        const saved = activeMentionRef.current;
        const trySaved = () => {
            if (!saved) return null;
            let startIndex = saved.startIndex;
            let cursor = saved.cursor;
            if (startIndex < 0 || startIndex >= docLen) return null;
            cursor = Math.min(Math.max(cursor, startIndex + 1), docLen);
            const segLen = cursor - startIndex;
            if (segLen < 1) return null;
            const seg = editor.getText(startIndex, segLen).replace(/\n/g, "");
            if (!seg.startsWith("@") || /\s/.test(seg.slice(1))) return null;
            return { startIndex, cursor };
        };

        const fromSaved = trySaved();
        if (fromSaved) return fromSaved;

        const ctx = getMentionContext(editor);
        return ctx ? { startIndex: ctx.startIndex, cursor: ctx.cursor } : null;
    }, []);

    const applyMention = useCallback(
        (user) => {
            const editor = getEditor();
            if (!editor) return;

            try {
                editor.focus({ preventScroll: true });
            } catch {
                editor.focus();
            }

            const range = resolveMentionRange(editor);
            if (!range) {
                activeMentionRef.current = null;
                setMentionOpen(false);
                setMentionHits([]);
                return;
            }

            const { startIndex, cursor } = range;
            const deleteLen = cursor - startIndex;
            if (deleteLen < 1) {
                activeMentionRef.current = null;
                setMentionOpen(false);
                return;
            }

            editor.deleteText(startIndex, deleteLen, "user");
            const insert = `@${user.name} `;
            editor.insertText(startIndex, insert, "user");
            editor.setSelection(startIndex + insert.length, 0, "user");

            const html =
                typeof editor.getSemanticHTML === "function"
                    ? editor.getSemanticHTML()
                    : editor.root.innerHTML;
            setData("comment", html);

            activeMentionRef.current = null;
            setMentionOpen(false);
            setMentionHits([]);

            if (!mentionedIdsRef.current.includes(user.id)) {
                mentionedIdsRef.current = [
                    ...mentionedIdsRef.current,
                    user.id,
                ];
                setData("mentioned_user_ids", mentionedIdsRef.current);
                setMentionChips((c) => [...c, { id: user.id, name: user.name }]);
            }
        },
        [setData, resolveMentionRange],
    );

    useEffect(() => {
        if (!mentionOpen) return;
        const onKeyDown = (e) => {
            if (!mentionHits.length) {
                if (e.key === "Escape") {
                    e.preventDefault();
                    activeMentionRef.current = null;
                    setMentionOpen(false);
                }
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                e.stopPropagation();
                setSelectedMentionIdx((i) =>
                    Math.min(i + 1, mentionHits.length - 1),
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                e.stopPropagation();
                setSelectedMentionIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                e.stopPropagation();
                const u = mentionHits[selectedMentionIdx];
                if (u) applyMention(u);
            } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                activeMentionRef.current = null;
                setMentionOpen(false);
            }
        };
        document.addEventListener("keydown", onKeyDown, true);
        return () => document.removeEventListener("keydown", onKeyDown, true);
    }, [mentionOpen, mentionHits, selectedMentionIdx, applyMention]);

    useEffect(() => {
        if (!mentionOpen) return;
        const onScrollOrResize = () => {
            const editor = getEditor();
            const ctx = editor && getMentionContext(editor);
            if (editor && ctx) updateMentionPosition(editor, ctx.cursor);
        };
        window.addEventListener("scroll", onScrollOrResize, true);
        window.addEventListener("resize", onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize, true);
            window.removeEventListener("resize", onScrollOrResize);
        };
    }, [mentionOpen, updateMentionPosition]);

    useLayoutEffect(() => {
        if (!mentionOpen || (type !== "create" && type !== "reply")) return;
        const editor = getEditor();
        const ctx = editor && getMentionContext(editor);
        if (editor && ctx) {
            updateMentionPosition(editor, ctx.cursor);
        }
    }, [mentionOpen, mentionHits, mentionLoading, type, updateMentionPosition]);

    useEffect(() => {
        if (!mentionOpen) return;
        const onDocMouseDown = (e) => {
            const editor = getEditor();
            if (editor?.root?.contains(e.target)) return;
            const t = e.target;
            if (t?.closest?.("[data-mention-dropdown]")) return;
            activeMentionRef.current = null;
            setMentionOpen(false);
        };
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [mentionOpen]);

    useEffect(() => {
        if (focus) {
            const editor =
                quillRef.current?.getEditor?.() || quillRef.current?.editor;
            if (editor) {
                const length = editor.getLength();
                editor.setSelection(length, length);
                editor.focus();
            }
        }
    }, [focus]);

    const handleQuillChange = (content, delta, source, editor) => {
        setData("comment", content);
        if (source === "user") {
            requestAnimationFrame(() => syncMentionFromEditor(editor));
        }
    };

    const handleSelectionChange = (range, source, editor) => {
        if (source !== "user" && source !== "api") return;
        if (!range) return;
        requestAnimationFrame(() => syncMentionFromEditor(editor));
    };

    const removeMention = (id) => {
        mentionedIdsRef.current = mentionedIdsRef.current.filter(
            (i) => i !== id,
        );
        setData("mentioned_user_ids", mentionedIdsRef.current);
        setMentionChips((c) => c.filter((x) => x.id !== id));
    };

    const mentionDropdown =
        mentionOpen &&
        (type === "create" || type === "reply") &&
        createPortal(
            <div
                data-mention-dropdown
                className="fixed z-[300] max-h-48 w-[min(100vw-2rem,280px)] overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-xl shadow-zinc-900/10 dark:border-white/15 dark:bg-zinc-900 dark:shadow-2xl dark:shadow-black/60"
                style={{
                    top: mentionCoords.top,
                    left: mentionCoords.left,
                }}
            >
                {mentionLoading && (
                    <p className="px-3 py-2 text-xs text-zinc-500">
                        Searching…
                    </p>
                )}
                {!mentionLoading &&
                    mentionHits.length === 0 &&
                    (mentionQuery.length > 0 ? (
                        <p className="px-3 py-2 text-xs text-zinc-500">
                            No members match “{mentionQuery}”
                        </p>
                    ) : (
                        <p className="px-3 py-2 text-xs text-zinc-500">
                            Type a name after @
                        </p>
                    ))}
                {!mentionLoading &&
                    mentionHits.map((u, idx) => (
                        <button
                            key={u.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyMention(u)}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                idx === selectedMentionIdx
                                    ? "bg-primary/20 text-zinc-900 dark:text-white"
                                    : "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10"
                            }`}
                        >
                            <img
                                src={u.profile_picture}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                            <span className="font-medium truncate">
                                {u.name}
                            </span>
                        </button>
                    ))}
            </div>,
            document.body,
        );

    return (
        <div className={`w-full ${className}`}>
            {(type === "create" || type === "reply") && (
                <p className="mb-2 text-xs text-zinc-500">
                    Type <span className="font-semibold text-primary">@</span>{" "}
                    to mention someone
                </p>
            )}

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-inner dark:border-white/10 dark:bg-zinc-950/50">
                <div className="quill-comment-box comment-quill w-full">
                    <ReactQuill
                        ref={quillRef}
                        value={data.comment}
                        onChange={handleQuillChange}
                        onChangeSelection={handleSelectionChange}
                        theme="snow"
                    />
                    {errors?.comment && (
                        <p className="border-t border-zinc-100 px-3 py-2 text-sm text-red-500 sm:px-4 dark:border-white/5 dark:text-red-400">
                            {errors?.comment}
                        </p>
                    )}
                </div>

                {mentionDropdown}

                {(type === "create" || type === "reply") &&
                    mentionChips.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-t border-zinc-100 px-3 py-3 sm:px-4 dark:border-white/5">
                            {mentionChips.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => removeMention(m.id)}
                                    className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/25"
                                >
                                    @{m.name}
                                    <span className="text-zinc-500">×</span>
                                </button>
                            ))}
                        </div>
                    )}

                <div className="flex justify-end border-t border-zinc-200 bg-zinc-50 px-4 py-4 sm:px-5 sm:py-4 dark:border-white/10 dark:bg-zinc-900/40">
                    <Button
                        type={"button"}
                        className={
                            "!my-0 !bg-primary !px-8 sm:!px-10 !py-2.5 shadow-md shadow-primary/20"
                        }
                        text={
                            type === "create"
                                ? "Comment"
                                : type === "reply"
                                  ? "Reply"
                                  : "Update"
                        }
                        onClick={() =>
                            post(
                                type === "create" || type === "reply"
                                    ? window.route("group.comment.create")
                                    : window.route("group.comment.update"),
                                {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        reset();
                                        mentionedIdsRef.current = [];
                                        activeMentionRef.current = null;
                                        setMentionChips([]);
                                        setMentionOpen(false);
                                        setMentionHits([]);
                                        onSuccess();
                                    },
                                },
                            )
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentForm;
