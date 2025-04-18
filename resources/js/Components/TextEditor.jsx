import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);

            // Upload to your server (Replace with actual API)
            const response = await fetch("/api/images/store", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data?.image) {
                const quill = window.quillRef;
                const range = quill.getSelection();
                quill.insertEmbed(range.index, "image", data.image);
                const img = quill.root.querySelector(
                    `img[src="${data.image}"]`
                );
                if (img) {
                    img.style.maxWidth = "100%";
                    img.style.height = "auto";
                    img.style.display = "block";
                    img.style.margin = "10px auto";
                }
            }
        }
    };
};

const modules = {
    toolbar: {
        container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"], // Add image button
            ["clean"],
        ],
        handlers: {
            image: imageHandler,
        },
    },
};

const TextEditor = ({ value, setValue }) => {
    const quillRef = React.useRef(null);
    const [height, setHeight] = useState(200); // Default minimum height

    useEffect(() => {
        if (quillRef.current) {
            window.quillRef = quillRef.current.getEditor();
        }
    }, []);

    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const quillContainer = quill.root;

            const updateHeight = () => {
                const newHeight = quillContainer.scrollHeight;

                // Ensure the height doesn't shrink too small
                const minHeight = 100; // Set your desired minimum height here

                if (newHeight > minHeight && newHeight !== height) {
                    setHeight(newHeight);
                    const qlContainer = quillContainer.closest(".ql-container");
                    if (qlContainer) {
                        qlContainer.style.setProperty(
                            "height",
                            `${Math.max(newHeight, minHeight)}px`,
                            "important"
                        );
                    }
                }
            };

            quill.on("text-change", updateHeight);
            updateHeight(); // Adjust height on mount

            return () => quill.off("text-change", updateHeight);
        }
    }, [height]);
    return (
        <div>
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={setValue}
                modules={modules}
            />
        </div>
    );
};

export default TextEditor;
