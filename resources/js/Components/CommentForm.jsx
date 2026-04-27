import React, { useCallback, useMemo, useRef } from "react";
import RichTextEditor from "@/Components/Editor/RichTextEditor";
import { useForm } from "@inertiajs/react";
import Button from "./Button";

const areNumberArraysEqual = (a = [], b = []) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

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

    const mentionedIdsRef = useRef([]);
    const isMentionEnabled = type === "create" || type === "reply";
    const mentionSuggestionsRoute = useMemo(
        () =>
            isMentionEnabled
                ? window.route("group.users.mention-suggestions")
                : null,
        [isMentionEnabled],
    );

    const handleMentionIdsChange = useCallback(
        (ids) => {
            if (areNumberArraysEqual(mentionedIdsRef.current, ids)) return;
            mentionedIdsRef.current = ids;
            setData("mentioned_user_ids", ids);
        },
        [setData],
    );

    return (
        <div className={`w-full ${className}`}>
            {isMentionEnabled && (
                <p className="mb-2 text-xs text-zinc-500">
                    Type <span className="font-semibold text-primary">@</span>{" "}
                    to mention someone
                </p>
            )}

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-inner dark:border-white/10 dark:bg-zinc-950/50">
                <div className="p-2">
                    <RichTextEditor
                        value={data.comment}
                        onChange={(html) => setData("comment", html)}
                        error={errors?.comment}
                        placeholder="Write your comment..."
                        autofocus={focus}
                        mentionEnabled={isMentionEnabled}
                        mentionSuggestionsRoute={mentionSuggestionsRoute}
                        onMentionIdsChange={handleMentionIdsChange}
                    />
                </div>

                <div className="flex justify-end border-t border-zinc-200 bg-zinc-50 px-2 py-2 sm:px-3 sm:py-2 dark:border-white/10 dark:bg-zinc-900/40">
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
