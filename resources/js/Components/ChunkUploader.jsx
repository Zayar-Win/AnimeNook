import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadFileInChunks } from "@/utils/chunkUpload";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { GripVertical } from "lucide-react";

function toArray(value, allowMultiple) {
    if (allowMultiple) {
        return Array.isArray(value) ? value : value ? [value] : [];
    }
    if (value == null || value === "") return [];
    return [value];
}

function extractPath(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && typeof value.path === "string") {
        return value.path;
    }
    return null;
}

function normalizeSource(path) {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return path.startsWith("/") ? path : `/${path}`;
}

function fileExt(name = "") {
    const idx = name.lastIndexOf(".");
    if (idx < 0) return "";
    return name.slice(idx).toLowerCase();
}

function fileNameFromPath(path = "") {
    const cleaned = String(path).split("?")[0];
    const parts = cleaned.split("/");
    return parts[parts.length - 1] || "file";
}

function isImageLike({ source, name, mime }) {
    if (typeof mime === "string" && mime.startsWith("image/")) return true;
    const candidate = source || name || "";
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(candidate);
}

function acceptFile(file, acceptedFileTypes) {
    if (!Array.isArray(acceptedFileTypes) || acceptedFileTypes.length === 0) {
        return true;
    }
    const mime = file.type || "";
    const ext = fileExt(file.name);
    return acceptedFileTypes.some((rule) => {
        if (!rule) return false;
        if (rule.startsWith(".")) return rule.toLowerCase() === ext;
        if (rule.endsWith("/*")) {
            const base = rule.slice(0, -1);
            return mime.startsWith(base);
        }
        return mime === rule;
    });
}

function makeItemFromValue(value, idPrefix, index) {
    if (value instanceof File) {
        return {
            id: `${idPrefix}-f-${value.name}-${value.size}-${value.lastModified}-${index}`,
            outputValue: value,
            name: value.name,
            source: null,
            isImage: isImageLike({ name: value.name, mime: value.type }),
            status: "idle",
            progress: 0,
            error: null,
            file: value,
        };
    }

    const sourcePath = extractPath(value);
    const source = normalizeSource(sourcePath);
    return {
        id: `${idPrefix}-r-${source || index}`,
        outputValue: value,
        name: fileNameFromPath(sourcePath || ""),
        source,
        isImage: isImageLike({ source, name: sourcePath || "" }),
        status: "done",
        progress: 100,
        error: null,
        file: null,
    };
}

const DND_TYPE = "chunk-uploader-card";

function UploadCard({
    item,
    index,
    totalItems,
    allowMultiple,
    disabled,
    previewUrl,
    onRemove,
    onReorder,
    onMoveStep,
    dragFromHandleOnly,
}) {
    const ref = useRef(null);
    const dragHandleRef = useRef(null);

    const [, drop] = useDrop({
        accept: DND_TYPE,
        canDrop: () => allowMultiple && !disabled,
        hover: (dragged, monitor) => {
            if (!ref.current) return;
            if (dragged.index === index) return;

            const rect = ref.current.getBoundingClientRect();
            const middleY = (rect.bottom - rect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - rect.top;

            // Only reorder after crossing midpoint to reduce jitter.
            if (dragged.index < index && hoverClientY < middleY) return;
            if (dragged.index > index && hoverClientY > middleY) return;

            onReorder(dragged.index, index);
            dragged.index = index;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: DND_TYPE,
        canDrag: allowMultiple && !disabled,
        item: () => ({ index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Touch: drag only from the grip (avoids image long-press / scroll stealing the gesture).
    // Desktop: whole card is draggable (HTML5 backend).
    if (dragFromHandleOnly) {
        drag(dragHandleRef);
        drop(ref);
    } else {
        drag(drop(ref));
    }

    return (
        <div
            ref={ref}
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#121212] ${
                allowMultiple ? "max-w-[220px]" : ""
            } ${
                isDragging
                    ? "opacity-75 scale-[0.98] ring-1 ring-primary/40 shadow-lg shadow-black/40"
                    : "transition-transform duration-200 ease-out"
            }`}
            style={{
                transformOrigin: "center center",
                willChange: "transform",
            }}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                }}
                className="absolute left-2 top-2 z-10 rounded-full bg-black/70 px-2 py-1 text-xs font-bold text-white hover:bg-black/90"
            >
                x
            </button>

            {allowMultiple && !disabled && dragFromHandleOnly && (
                <div
                    ref={dragHandleRef}
                    aria-label="Drag to reorder"
                    className="absolute right-2 top-2 z-10 flex h-10 w-10 cursor-grab items-center justify-center rounded-lg bg-black/70 text-white touch-none active:cursor-grabbing"
                    style={{
                        touchAction: "none",
                        WebkitTouchCallout: "none",
                    }}
                >
                    <GripVertical className="h-5 w-5" aria-hidden />
                </div>
            )}

            {allowMultiple && (
                <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 sm:hidden">
                    <button
                        type="button"
                        disabled={disabled || index <= 0}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveStep(index, -1);
                        }}
                        className="rounded bg-black/70 px-2 py-1 text-[11px] font-bold text-white disabled:opacity-40"
                        aria-label="Move image up"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        disabled={disabled || index >= totalItems - 1}
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveStep(index, 1);
                        }}
                        className="rounded bg-black/70 px-2 py-1 text-[11px] font-bold text-white disabled:opacity-40"
                        aria-label="Move image down"
                    >
                        ↓
                    </button>
                </div>
            )}

            <div
                className={`w-full overflow-hidden bg-black/30 ${
                    allowMultiple ? "h-24" : "h-36"
                }`}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={item.name}
                        draggable={false}
                        className="h-full w-full select-none object-cover"
                        style={{ WebkitTouchCallout: "none" }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-zinc-400">
                        {item.name}
                    </div>
                )}
            </div>

            <div
                className={`space-y-0.5 ${
                    allowMultiple ? "px-1 py-1" : "px-1.5 py-1.5"
                }`}
            >
                <p className="truncate text-xs font-semibold text-zinc-200">
                    {item.name}
                </p>
                {item.status === "uploading" && item.progress < 100 && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                            <span>Uploading</span>
                            <span>{Math.round(item.progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded bg-white/10">
                            <div
                                className="h-full rounded bg-primary transition-all duration-200"
                                style={{
                                    width: `${Math.max(0, Math.min(100, item.progress))}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
                {item.status === "error" && item.error && (
                    <p className="text-[11px] text-red-400">{item.error}</p>
                )}
            </div>
        </div>
    );
}

const ChunkUploader = ({
    photos,
    onUpload,
    allowMultiple = false,
    acceptedFileTypes = [],
    allowImagePreview = true,
    maxFiles,
    uploadMode = "manual",
    chunkTarget = null,
    chunkSize = 1024 * 1024,
    disabled = false,
    onUploadingChange,
}) => {
    const reactId = useMemo(
        () => `cu-${Math.random().toString(36).slice(2, 10)}`,
        [],
    );
    const inputRef = useRef(null);
    const objectUrlsRef = useRef(new Map());
    const [items, setItems] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const isTouchDevice = useMemo(() => {
        if (typeof window === "undefined") return false;
        const hasTouchPoints =
            typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
        const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches;
        return "ontouchstart" in window || hasTouchPoints || coarsePointer;
    }, []);
    const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
    const dndBackendOptions = isTouchDevice
        ? {
              enableMouseEvents: true,
              // Short delay: long presses feel broken; handle uses touch-action: none.
              delayTouchStart: 50,
          }
        : undefined;

    useEffect(() => {
        const base = toArray(photos, allowMultiple);
        const next = base
            .map((value, index) => makeItemFromValue(value, reactId, index))
            .filter(Boolean);

        setItems((prev) => {
            const prevById = new Map(prev.map((i) => [i.id, i]));
            return next.map((item) => {
                const existing = prevById.get(item.id);
                if (!existing) return item;
                return {
                    ...item,
                    status: existing.status,
                    progress: existing.progress,
                    error: existing.error,
                };
            });
        });
    }, [allowMultiple, photos, reactId]);

    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            objectUrlsRef.current.clear();
        };
    }, []);

    const uploadingCount = useMemo(
        () => items.filter((item) => item.status === "uploading").length,
        [items],
    );

    useEffect(() => {
        if (typeof onUploadingChange === "function") {
            onUploadingChange(uploadingCount);
        }
    }, [onUploadingChange, uploadingCount]);

    const emitValues = (nextItems) => {
        const out = nextItems.map((item) => item.outputValue).filter(Boolean);
        if (allowMultiple) {
            onUpload(out);
            return;
        }
        onUpload(out[0] ?? null);
    };

    const updateItems = (updater) => {
        setItems((prev) => {
            const next = updater(prev);
            emitValues(next);
            return next;
        });
    };

    const removeItem = (id) => {
        updateItems((prev) => prev.filter((item) => item.id !== id));
    };

    const reorderItemsByIndex = (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        updateItems((prev) => {
            if (
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= prev.length ||
                toIndex >= prev.length
            ) {
                return prev;
            }
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const moveItemByStep = (index, step) => {
        if (!allowMultiple) return;
        const toIndex = index + step;
        reorderItemsByIndex(index, toIndex);
    };

    const startAutoUpload = async (itemId, file) => {
        if (uploadMode !== "auto" || !chunkTarget) return;

        updateItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, status: "uploading", progress: 0, error: null }
                    : item,
            ),
        );

        try {
            const url = await uploadFileInChunks({
                file,
                target: chunkTarget,
                chunkSize,
                onProgress: ({ percent }) => {
                    setItems((prev) =>
                        prev.map((item) =>
                            item.id === itemId
                                ? { ...item, status: "uploading", progress: percent }
                                : item,
                        ),
                    );
                },
            });

            updateItems((prev) =>
                prev.map((item) =>
                    item.id === itemId
                        ? {
                              ...item,
                              outputValue: url,
                              source: normalizeSource(url),
                              status: "done",
                              progress: 100,
                              error: null,
                              file: null,
                              isImage: isImageLike({ source: url, name: item.name }),
                          }
                        : item,
                ),
            );
        } catch (err) {
            updateItems((prev) =>
                prev.map((item) =>
                    item.id === itemId
                        ? {
                              ...item,
                              status: "error",
                              progress: 0,
                              error:
                                  err?.response?.data?.message ??
                                  err?.message ??
                                  "Upload failed",
                          }
                        : item,
                ),
            );
        }
    };

    const addFiles = (incoming) => {
        if (disabled) return;
        const files = Array.from(incoming || []);
        if (!files.length) return;

        const valid = [];
        const rejected = [];
        files.forEach((file) => {
            if (acceptFile(file, acceptedFileTypes)) valid.push(file);
            else rejected.push(file.name);
        });

        if (rejected.length) {
            setError(`Unsupported file type: ${rejected.join(", ")}`);
        } else {
            setError("");
        }

        if (!valid.length) return;

        const existing = toArray(photos, allowMultiple);
        let merged = allowMultiple ? [...existing, ...valid] : [valid[0]];
        if (typeof maxFiles === "number" && maxFiles > 0) {
            merged = merged.slice(0, maxFiles);
        }

        const nextItems = merged
            .map((value, index) => makeItemFromValue(value, reactId, index))
            .filter(Boolean);
        setItems(nextItems);
        emitValues(nextItems);

        if (uploadMode === "auto" && chunkTarget) {
            nextItems.forEach((item) => {
                if (item.file instanceof File) {
                    startAutoUpload(item.id, item.file);
                }
            });
        }
    };

    const openPicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const onInputChange = (e) => {
        addFiles(e.target.files);
        e.target.value = "";
    };

    return (
        <div className="space-y-3">
            <div
                role="button"
                tabIndex={0}
                onClick={openPicker}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openPicker();
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addFiles(e.dataTransfer.files);
                }}
                className={`rounded-xl border border-dashed p-4 text-center transition ${
                    disabled
                        ? "cursor-not-allowed border-white/10 opacity-60"
                        : dragOver
                          ? "border-primary bg-primary/10"
                          : "cursor-pointer border-white/15 bg-black/20 hover:border-white/25 hover:bg-black/30"
                }`}
            >
                <p className="text-sm font-semibold text-zinc-200">
                    Drag & drop files here or browse
                </p>
                {acceptedFileTypes?.length > 0 && (
                    <p className="mt-1 text-[11px] text-zinc-500">
                        Allowed: {acceptedFileTypes.join(", ")}
                    </p>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    multiple={allowMultiple}
                    accept={acceptedFileTypes.join(",")}
                    onChange={onInputChange}
                    disabled={disabled}
                />
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            {items.length > 0 && (
                <DndProvider backend={dndBackend} options={dndBackendOptions}>
                    <div
                        className={`grid gap-3 ${
                            allowMultiple
                                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                                : "grid-cols-1"
                        }`}
                    >
                        {items.map((item, index) => {
                            const previewUrl =
                                allowImagePreview && item.isImage
                                    ? item.file instanceof File
                                        ? (() => {
                                              if (objectUrlsRef.current.has(item.id)) {
                                                  return objectUrlsRef.current.get(
                                                      item.id,
                                                  );
                                              }
                                              const url = URL.createObjectURL(
                                                  item.file,
                                              );
                                              objectUrlsRef.current.set(
                                                  item.id,
                                                  url,
                                              );
                                              return url;
                                          })()
                                        : item.source
                                    : null;

                            return (
                                <UploadCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    totalItems={items.length}
                                    allowMultiple={allowMultiple}
                                    disabled={disabled}
                                    dragFromHandleOnly={isTouchDevice}
                                    previewUrl={previewUrl}
                                    onRemove={removeItem}
                                    onReorder={reorderItemsByIndex}
                                    onMoveStep={moveItemByStep}
                                />
                            );
                        })}
                    </div>
                </DndProvider>
            )}
        </div>
    );
};

export default ChunkUploader;
