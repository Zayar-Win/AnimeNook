import React, { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { usePage } from "@inertiajs/react";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const sourceGenerator = (fileType, env) => {
    if (fileType == "ChapterImage") {
        if (env == "local") {
        }
    }
};

const FilePondUploader = ({ photos, onUpload, allowMultiple = false }) => {
    const { env, APP_URL } = usePage().props;
    const [files, setFiles] = useState([]);
    const filePond = useRef();
    const computedFiles = useMemo(() => {
        if (Array.isArray(photos)) {
            return photos.map((photo) => {
                // If it's a File, don't wrap it
                if (photo instanceof File) {
                    return photo;
                }

                const filePath =
                    typeof photo === "string"
                        ? photo
                        : typeof photo === "object" && photo.path
                        ? photo.path
                        : null;

                return {
                    source: env === "local" ? APP_URL + filePath : filePath,
                     options: {
                        metadata: photo
                    },
                };
            });
        }

        if (photos) {
            if (photos instanceof File) {
                return [photos];
            }

            const filePath =
                typeof photos === "string"
                    ? photos
                    : typeof photos === "object" && photos.path
                    ? photos.path
                    : null;

            return [
                {
                    source: APP_URL + filePath,
                   
                },
            ];
        }

        return [];
    }, [photos]);

    console.log(photos, computedFiles);

    const onupdatefiles = (files) => {
        setFiles(files)
        if (files.length > 0) {
            if (allowMultiple) {
                let files = filePond.current?.getFiles();
                onUpload(files.map((f) => {
                    if(f.source instanceof File){
                        return f.file
                    }else{
                        return f.getMetadata()
                    }
                }));
            } else {
                let file = filePond.current?.getFile().file;
                if (file instanceof File) {
                    onUpload(file);
                }
            }
        }
    }

    return (
        <FilePond
            files={computedFiles}
            ref={filePond}
            onreorderfiles={onupdatefiles}
            onupdatefiles={(files) => {
                onupdatefiles(files)
            }}
            allowMultiple={allowMultiple}
            name="filepond"
            allowImagePreview
            allowReorder
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
    );
};

export default FilePondUploader;
