import React, { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const FilePondUploader = ({ photos, onUpload, allowMultiple = false }) => {
    const [files, setFiles] = useState([]);
    const filePond = useRef();
    const computedFiles = useMemo(() => {
        if (Array.isArray(photos)) {
            return photos.map((photo) => ({
                source: photo,
            }));
        }
        if (photos) {
            return [
                {
                    source: photos,
                },
            ];
        }
        return null;
    }, [photos]);
    useEffect(() => {
        if (files.length > 0) {
            if (allowMultiple) {
                let files = filePond.current?.getFiles();
                onUpload(files.map((f) => f.file));
            } else {
                let file = filePond.current?.getFile().file;
                if (file instanceof File) {
                    onUpload(file);
                }
            }
        }
    }, [files]);
    return (
        <FilePond
            files={computedFiles}
            ref={filePond}
            onupdatefiles={setFiles}
            name="filepond"
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
    );
};

export default FilePondUploader;
