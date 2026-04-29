import { mangaThumbnailUrl } from "@/app";
import Select from "@/Components/Select";
import Tag from "@/Components/Tag";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { Link, router } from "@inertiajs/react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
    BANNER: "BANNER",
};

const DraggableBanner = ({ item, index, moveItem, removeItem }) => {
    const [, dragRef] = useDrag({
        type: ItemType.BANNER,
        item: { index },
    });

    const [, dropRef] = useDrop({
        accept: ItemType.BANNER,
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => dragRef(dropRef(node))}
            className="touch-manipulation bg-[#1a1a1a] border border-white/5 relative pb-2 min-h-[180px] sm:min-h-[200px] rounded-xl sm:rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/50 active:scale-[0.99]"
        >
            <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="w-9 h-9 flex items-center justify-center absolute top-2 right-2 rounded-full bg-red-500/90 text-white cursor-pointer hover:bg-red-500 transition-colors z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm shadow-md"
                aria-label="Remove from banners"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div className="relative h-[120px] xs:h-[140px] sm:h-[150px] overflow-hidden">
                <img
                    src={item.bannerable?.thumbnail || mangaThumbnailUrl}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.bannerable?.name ?? ""}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            </div>
            <div className="p-3 sm:p-4 relative">
                <h2 className="text-base sm:text-lg font-bold text-white line-clamp-2 sm:line-clamp-1 mb-1">
                    {item?.bannerable?.name}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 sm:mb-3">
                    Manga
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                    {(item?.bannerable?.tags ?? []).slice(0, 3).map((tag) => (
                        <Tag
                            tag={tag}
                            className={
                                "!bg-white/5 !text-zinc-300 !text-[9px] sm:!text-[10px] !px-1.5 sm:!px-2 !py-0.5 border border-white/5"
                            }
                            key={tag.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Index = ({ banners = [], allBanners = [] }) => {
    const [items, setItems] = useState(
        (banners ?? [])
            .filter(Boolean)
            .map((banner, index) => ({ id: index + 1, ...banner }))
    );
    const [bannerOptions, setBannerOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        setBannerOptions(
            (allBanners ?? [])
                .filter(Boolean)
                .filter((banner) => {
                    return !items.find(
                        (item) =>
                            item?.bannerable?.type === banner?.type &&
                            item?.bannerable?.id === banner?.id
                    );
                })
                .map((banner) => ({
                    value: {
                        bannerable: banner,
                    },
                    label: banner.name,
                }))
        );
    }, [items, allBanners]);

    const moveItem = (fromIndex, toIndex) => {
        setItems((prevItems) => {
            const updatedItems = [...prevItems];
            [updatedItems[fromIndex], updatedItems[toIndex]] = [
                updatedItems[toIndex],
                updatedItems[fromIndex],
            ];
            return updatedItems;
        });
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBanner(null);
    };

    const openAddModal = () => {
        setSelectedBanner(null);
        setOpen(true);
    };

    const handleUpdate = () => {
        router.post(window.route("group.admin.banners.update"), {
            banners: items,
        });
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen px-4 py-6 sm:p-6 lg:p-8 text-white">
            <Modal
                open={open}
                onClose={handleClose}
                disableAutoFocus
                slotProps={{
                    backdrop: { className: "!bg-black/70" },
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw-2rem,400px)] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-5 sm:p-6 focus:outline-none mx-4">
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="!font-black !text-white !text-center !mb-1 !tracking-tight !text-lg sm:!text-xl"
                    >
                        Add manga to slider
                    </Typography>
                    <p className="text-center text-zinc-500 text-xs sm:text-sm mb-5">
                        Only manga from this group appear on the homepage hero.
                    </p>
                    <div className="mt-2">
                        <Select
                            label="Manga"
                            options={bannerOptions}
                            onChange={(option) =>
                                setSelectedBanner(option?.value ?? null)
                            }
                        />
                    </div>
                    {bannerOptions.length === 0 && (
                        <p className="mt-3 text-center text-xs text-zinc-500">
                            All manga are already in the slider, or none exist
                            yet.
                        </p>
                    )}
                    <Button
                        variant="contained"
                        disabled={!selectedBanner}
                        onClick={() => {
                            if (!selectedBanner?.bannerable) return;
                            setItems((prev) => [
                                ...prev,
                                {
                                    id: Date.now(),
                                    bannerable: selectedBanner.bannerable,
                                },
                            ]);
                            handleClose();
                        }}
                        className="!bg-primary !w-full !mt-5 !py-3 !rounded-xl !font-bold !normal-case !shadow-lg !shadow-primary/20 hover:!bg-primary/90 disabled:!bg-zinc-800 disabled:!text-zinc-600"
                    >
                        Add to banners
                    </Button>
                </Box>
            </Modal>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-white/10">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)] shrink-0">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            ></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                            Homepage banners
                        </h1>
                        <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-1 leading-snug">
                            Manga-only slides. Drag cards to reorder on desktop;
                            tap + to add, then save.
                        </p>
                    </div>
                </div>

                <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                    <Link
                        href={window.route("group.admin.dashboard")}
                        className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-4 text-xs font-bold text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:text-sm"
                    >
                        Back to dashboard
                    </Link>
                    <Button
                        variant="contained"
                        className="!bg-primary hover:!bg-primary/90 !min-w-0 !flex-1 sm:!flex-none !h-12 !w-full sm:!w-12 !rounded-xl !font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                        onClick={openAddModal}
                        aria-label="Add manga banner"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </Button>
                    <Button
                        variant="contained"
                        className="!bg-primary hover:!bg-primary/90 !flex-[2] sm:!flex-none !px-4 sm:!px-8 !py-3 !h-12 !rounded-xl !font-bold !text-sm !normal-case shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                        onClick={handleUpdate}
                    >
                        Save changes
                    </Button>
                </div>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-white/5 bg-[#1a1a1a]/50 min-h-[240px] sm:min-h-[300px] p-4 sm:p-6 rounded-2xl sm:rounded-3xl gap-4 sm:gap-6 shadow-inner">
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <DraggableBanner
                                key={item?.banner_id ?? `${item?.bannerable?.slug ?? "banner"}-${item?.id ?? index}`}
                                item={item}
                                index={index}
                                moveItem={moveItem}
                                removeItem={removeItem}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 py-12 sm:py-16 px-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-14 h-14 sm:w-16 sm:h-16 mb-4 opacity-20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"
                                ></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <p className="text-base sm:text-lg font-bold opacity-50 text-center">
                                No banners yet
                            </p>
                            <p className="text-xs sm:text-sm text-center max-w-sm mt-1">
                                Add manga titles to show them in the homepage
                                slider.
                            </p>
                        </div>
                    )}
                </div>
            </DndProvider>
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
