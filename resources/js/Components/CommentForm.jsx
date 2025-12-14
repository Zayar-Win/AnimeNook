import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import { useForm } from "@inertiajs/react";
import Button from "./Button";

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
        commentId: comment?.id,
    });
    const quillRef = useRef();
    useEffect(() => {
        if (focus) {
            let editor = quillRef.current.editor;
            let length = editor.getLength();
            editor.setSelection(length, length);
            editor.focus();
        }
    }, []);
    return (
        <div className={`w-full ${className}`}>
            <div className="grow h-[150px] w-full">
                <ReactQuill
                    ref={quillRef}
                    value={data.comment}
                    onChange={(data) => setData("comment", data)}
                    theme="snow"
                />
                {errors?.comment && (
                    <span className="text-red-500">{errors?.comment}</span>
                )}
            </div>
            <div className="flex justify-end xs:mt-0 mt-5">
                <Button
                    type={"button"}
                    className={"!bg-primary my-2 !px-10"}
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
                                    onSuccess();
                                },
                            }
                        )
                    }
                />
            </div>
        </div>
    );
};

export default CommentForm;
