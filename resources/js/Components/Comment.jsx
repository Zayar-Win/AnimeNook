import React, { useState } from "react";
import { format } from "timeago.js";
import Reply from "@/../assets/Reply";
import Edit from "@/../assets/Edit";
import Delete from "@/../assets/Delete";
import Liked from "@/../assets/Liked";
import CommentForm from "./CommentForm";
import DeleteModal from "./DeleteModal";
import { router } from "@inertiajs/react";

const Comment = ({ comment, auth, anime, manga, isReply = false }) => {
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
    const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);

    const commentDelete = () => {
        router.post(
            window.route("group.comment.delete", { comment }),
            comment,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteModelOpen(false);
                },
            }
        );
    };

    const likeOrUnlike = () => {
        router.post(
            window.route("group.comment.like", { comment }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <div className={`group/comment relative ${isReply ? "mt-6" : "mt-8"}`}>
            {/* Connector Line for Replies */}
            {isReply && (
                <div className="absolute -left-[34px] top-0 h-8 w-8 -translate-y-1/2 rounded-bl-xl border-b-2 border-l-2 border-zinc-200 dark:border-white/10"></div>
            )}

            <div className="flex gap-4">
                <div className="shrink-0 relative z-10">
                    <img
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-200 transition-all duration-300 group-hover/comment:ring-primary/50 dark:ring-white/10"
                        src={comment?.user?.profile_picture}
                        alt={comment?.user?.name}
                    />
                </div>
                <div className="flex flex-col grow min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3 className="cursor-pointer text-sm font-bold text-zinc-900 transition-colors hover:text-primary dark:text-white">
                            {comment?.user?.name}
                        </h3>
                        <span className="text-zinc-500 text-xs font-medium">
                            {format(comment?.created_at)}
                        </span>
                        {comment?.user_id === auth?.user?.id && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/20">
                                YOU
                            </span>
                        )}
                    </div>

                    {isEditFormOpen ? (
                        <div className="mt-2">
                            <CommentForm
                                anime={anime}
                                manga={manga}
                                onSuccess={() => setIsEditFormOpen(false)}
                                comment={comment}
                                focus
                                type="update"
                                className="comment-quill"
                            />
                        </div>
                    ) : (
                        <>
                            <div
                                className="break-words text-sm leading-relaxed text-zinc-800 dark:text-zinc-300 [&>p]:mb-2 [&>p]:text-inherit last:[&>p]:mb-0 [&_a.comment-mention-link]:text-primary [&_a.comment-mention-link]:hover:underline [&_li]:text-inherit [&_strong]:text-inherit [&_em]:text-inherit [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-tight [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_mark]:rounded [&_mark]:bg-yellow-300/60 [&_mark]:px-0.5"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        comment.display_body ??
                                        comment.displayBody ??
                                        comment.body,
                                }}
                            />

                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={likeOrUnlike}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                        comment?.isLikeByCurrentUser
                                            ? "text-pink-500"
                                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Liked
                                        className={`w-4 h-4 ${
                                            comment?.isLikeByCurrentUser
                                                ? "text-pink-500 fill-pink-500"
                                                : "fill-current"
                                        }`}
                                    />
                                    <span>
                                        {comment?.likes_count || "Like"}
                                    </span>
                                </button>

                                {!comment?.comment_id && (
                                    <button
                                        onClick={() =>
                                            setIsReplyFormOpen((prev) => !prev)
                                        }
                                        className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                                    >
                                        <Reply className="w-4 h-4" />
                                        <span>Reply</span>
                                    </button>
                                )}

                                {auth?.user?.id === comment?.user_id && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setIsEditFormOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() =>
                                                setIsDeleteModelOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-500 transition-colors"
                                        >
                                            <Delete className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    {isDeleteModelOpen && (
                        <DeleteModal
                            title={"Delete Comment"}
                            deleteHandler={commentDelete}
                            setIsDeleteModalOpen={setIsDeleteModelOpen}
                        />
                    )}

                    {isReplyFormOpen && (
                        <div className="mt-4 border-l-2 border-zinc-200 pl-4 dark:border-white/10">
                            <CommentForm
                                anime={anime}
                                manga={manga}
                                onSuccess={() => setIsReplyFormOpen(false)}
                                comment={comment}
                                focus
                                type="reply"
                                className="comment-quill"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Comments (Replies) */}
            {comment?.comments?.length > 0 && (
                <div className="ml-[20px] mt-4 space-y-6 border-l-2 border-zinc-200 pl-[20px] dark:border-white/5">
                    {comment.comments.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            manga={manga}
                            anime={anime}
                            auth={auth}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
