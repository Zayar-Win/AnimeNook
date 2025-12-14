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
                <div className="absolute -left-[34px] top-0 w-8 h-8 border-b-2 border-l-2 border-white/10 rounded-bl-xl -translate-y-1/2"></div>
            )}

            <div className="flex gap-4">
                <div className="shrink-0 relative z-10">
                    <img
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 group-hover/comment:ring-primary/50 transition-all duration-300"
                        src={comment?.user?.profile_picture}
                        alt={comment?.user?.name}
                    />
                </div>
                <div className="flex flex-col grow min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                        <h3 className="text-white font-bold text-sm hover:text-primary transition-colors cursor-pointer">
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
                                className="dark-form"
                            />
                        </div>
                    ) : (
                        <>
                            <div
                                className="text-zinc-300 text-sm leading-relaxed break-words [&>p]:mb-2 last:[&>p]:mb-0"
                                dangerouslySetInnerHTML={{
                                    __html: comment.body,
                                }}
                            />

                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    onClick={likeOrUnlike}
                                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                        comment?.isLikeByCurrentUser
                                            ? "text-pink-500"
                                            : "text-zinc-500 hover:text-white"
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
                                        className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
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
                                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
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
                            setIsDeleteModelOpen={setIsDeleteModelOpen}
                        />
                    )}

                    {isReplyFormOpen && (
                        <div className="mt-4 pl-4 border-l-2 border-white/10">
                            <CommentForm
                                anime={anime}
                                manga={manga}
                                onSuccess={() => setIsReplyFormOpen(false)}
                                comment={comment}
                                focus
                                type="reply"
                                className="dark-form"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Comments (Replies) */}
            {comment?.comments?.length > 0 && (
                <div className="pl-[20px] ml-[20px] border-l-2 border-white/5 space-y-6 mt-4">
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
