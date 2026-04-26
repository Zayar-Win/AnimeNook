import axios from "axios";

function getCsrfToken() {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el?.getAttribute("content") ?? null;
}

/**
 * Upload a file in chunks to the group admin chunk endpoints.
 *
 * - init: POST group.admin.uploads.init
 * - chunk: POST group.admin.uploads.chunk
 * - finish: POST group.admin.uploads.finish
 * - abort: DELETE group.admin.uploads.abort
 */
export async function uploadFileInChunks({
    file,
    target,
    chunkSize = 1024 * 1024,
    onProgress,
}) {
    if (!(file instanceof File)) {
        throw new Error("uploadFileInChunks expects a File");
    }

    const csrf = getCsrfToken();

    const initRes = await axios.post(
        window.route("group.admin.uploads.init"),
        {
            target,
            file_name: file.name,
            content_type: file.type || "application/octet-stream",
            size_bytes: file.size,
        },
        {
            headers: csrf ? { "X-CSRF-TOKEN": csrf } : undefined,
            withCredentials: true,
        },
    );

    const uploadId = initRes?.data?.upload_id;
    if (!uploadId) {
        throw new Error("Failed to initialize upload");
    }

    let offset = 0;
    try {
        while (offset < file.size) {
            const end = Math.min(offset + chunkSize, file.size);
            const chunk = file.slice(offset, end);

            const fd = new FormData();
            // Provide a filename so Laravel treats it as an uploaded file.
            fd.append("chunk", chunk, file.name);
            fd.append("offset", String(offset));
            fd.append("total_size", String(file.size));

            let chunkRes;
            try {
                chunkRes = await axios.post(
                    window.route("group.admin.uploads.chunk", {
                        upload: uploadId,
                    }),
                    fd,
                    {
                        headers: {
                            ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                            "Content-Type": "multipart/form-data",
                        },
                        withCredentials: true,
                    },
                );
            } catch (err) {
                const status = err?.response?.status;
                const conflictOffset = Number(
                    err?.response?.data?.next_offset,
                );
                // 409 means server and client offsets drifted; resume from server offset.
                if (status === 409 && Number.isFinite(conflictOffset)) {
                    offset = Math.max(0, conflictOffset);
                    continue;
                }
                throw err;
            }

            const nextOffset = Number(chunkRes?.data?.next_offset);
            if (!Number.isFinite(nextOffset) || nextOffset <= offset) {
                throw new Error(
                    `Chunk upload did not advance offset (current=${offset}, next=${nextOffset})`,
                );
            }
            offset = nextOffset;

            if (typeof onProgress === "function") {
                onProgress({
                    loaded: offset,
                    total: file.size,
                    percent: file.size ? Math.round((offset / file.size) * 100) : 0,
                });
            }
        }

        const finishRes = await axios.post(
            window.route("group.admin.uploads.finish", { upload: uploadId }),
            {},
            {
                headers: csrf ? { "X-CSRF-TOKEN": csrf } : undefined,
                withCredentials: true,
            },
        );

        const url = finishRes?.data?.url;
        if (!url) {
            throw new Error("Upload finished but no url returned");
        }

        return url;
    } catch (err) {
        try {
            await axios.delete(
                window.route("group.admin.uploads.abort", { upload: uploadId }),
                {
                    headers: csrf ? { "X-CSRF-TOKEN": csrf } : undefined,
                    withCredentials: true,
                },
            );
        } catch {
            // ignore cleanup errors
        }
        throw err;
    }
}

