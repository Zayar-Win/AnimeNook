import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

/** Avoid re-running FilePond setOptions/DID_SET_FILES when unrelated parent state changes (e.g. a second FilePond on the same form). */
function filePondPropsAreEqual(prev, next) {
    const keys = [
        "allowMultiple",
        "name",
        "id",
        "className",
        "labelIdle",
        "allowImagePreview",
        "allowReorder",
        "itemInsertLocation",
        "imagePreviewHeight",
        "itemPanelAspectRatio",
        "instantUpload",
    ];
    for (const k of keys) {
        if (prev[k] !== next[k]) return false;
    }
    if (prev.onupdatefiles !== next.onupdatefiles) return false;
    if (prev.onreorderfiles !== next.onreorderfiles) return false;
    const a = prev.files;
    const b = next.files;
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
        return false;
    return a.every((f, i) => f === b[i]);
}

const MemoFilePond = memo(
    forwardRef((props, ref) => <FilePond ref={ref} {...props} />),
    filePondPropsAreEqual,
);

const FilePondUploader = ({ photos, onUpload, allowMultiple = false }) => {
    const reactId = useId().replace(/:/g, "");
    const inputId = `filepond-${reactId}`;
    const inputName = `filepond_${reactId}`;
    // State to hold the current files for FilePond
    const [files, setFiles] = useState([]);
    const filePond = useRef();
    const onUploadRef = useRef(onUpload);
    onUploadRef.current = onUpload;

    // Effect to initialize or update files based on 'photos' prop
    // WE ONLY UPDATE if 'photos' contains server paths/URLs/metadata objects.
    // WE DO NOT UPDATE if 'photos' contains raw File objects (which likely came from this uploader)
    // because that causes FilePond to reset/flicker.
    useEffect(() => {
        if (!photos) {
            setFiles([]);
            return;
        }

        let newFiles = [];
        let hasRawFiles = false;

        const processItem = (item) => {
            if (item instanceof File) {
                hasRawFiles = true;
                return item;
            }

            const filePath =
                typeof item === "string"
                    ? item
                    : typeof item === "object" && item.path
                      ? item.path
                      : null;

            if (!filePath) return null;

            // Root-relative or absolute URL. Same-origin paths must NOT use type: 'local':
            // FilePond only loads LOCAL items via server.load; without it, fetchFn is null
            // and FilePond shows fake "400 (Can't load URL)". INPUT + string uses fetchBlob (GET).
            let source = filePath;
            if (filePath && !filePath.startsWith("http")) {
                source = filePath.startsWith("/") ? filePath : `/${filePath}`;
            }

            return {
                source,
                options: {
                    metadata: item,
                },
            };
        };

        if (Array.isArray(photos)) {
            newFiles = photos.map(processItem).filter(Boolean);
        } else {
            const processed = processItem(photos);
            if (processed) newFiles = [processed];
        }

        // CRITICAL: Only update FilePond state if we don't have raw files (meaning it's an initial load or reset)
        // OR if the array is empty (cleared).
        // OR if FilePond is currently empty (meaning we likely remounted and lost state)
        const currentPondFiles = filePond.current?.getFiles() || [];
        if (
            !hasRawFiles ||
            newFiles.length === 0 ||
            currentPondFiles.length === 0
        ) {
            setFiles(newFiles);
        }
    }, [photos]);

    const onupdatefiles = useCallback(
        (fileItems) => {
            // FilePond gives us a list of file items.
            // We update our local state to keep FilePond happy
            setFiles(
                fileItems.map((fileItem) => fileItem.file).filter(Boolean),
            );

            const push = onUploadRef.current;
            if (allowMultiple) {
                push(
                    fileItems.map((f) => {
                        if (f.file instanceof File) {
                            return f.file;
                        } else {
                            // Return metadata or source for existing files
                            return f.getMetadata() || f.source;
                        }
                    }),
                );
            } else {
                const fileItem = fileItems[0];
                if (!fileItem) {
                    push(null);
                    return;
                }
                const blob = fileItem.file;
                if (blob instanceof File || blob instanceof Blob) {
                    push(blob);
                } else {
                    push(fileItem.getMetadata?.() ?? fileItem.source ?? null);
                }
            }
        },
        [allowMultiple],
    );

    return (
        <MemoFilePond
            id={inputId}
            files={files}
            ref={filePond}
            onreorderfiles={onupdatefiles}
            onupdatefiles={onupdatefiles}
            allowMultiple={allowMultiple}
            name={inputName}
            instantUpload={false}
            allowImagePreview
            allowReorder
            itemInsertLocation="after"
            imagePreviewHeight={150} // Limit preview height
            itemPanelAspectRatio={null} // Let height be determined by content/fixed
            className={allowMultiple ? "filepond-grid" : ""} // Add class for grid styling
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
    );
};

export default FilePondUploader;
