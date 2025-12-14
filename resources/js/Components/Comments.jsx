import React from "react";
import { usePage } from "@inertiajs/react";
import Comment from "./Comment";

const Comments = ({ comments, anime, manga }) => {
    const { auth } = usePage().props;
    return (
        <div className="space-y-6">
            {comments?.length > 0 ? (
                comments.map((comment, i) => (
                    <Comment
                        key={i}
                        comment={comment}
                        manga={manga}
                        anime={anime}
                        auth={auth}
                    />
                ))
            ) : (
                <div className="w-full py-10 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-zinc-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <p className="text-xl font-bold text-white mb-2">
                        No comments yet
                    </p>
                    <p className="text-zinc-500 text-sm">
                        Be the first to share your thoughts!
                    </p>
                </div>
            )}
        </div>
    );
};

export default Comments;
