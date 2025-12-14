import Select from "@/Components/Select";
import Tag from "@/Components/Tag";
import GroupAdminLayout from "@/Layouts/GroupAdminLayout";
import { router } from "@inertiajs/react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "white",
    border: "none",
    boxShadow: 24,
    p: 4,
};

// Drag item type
const ItemType = {
    BANNER: "BANNER",
};

// Draggable Banner Component
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
            className="bg-[#1a1a1a] border border-white/5 relative pb-2 min-h-[200px] rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 shadow-lg shadow-black/50"
        >
            <div
                onClick={() => removeItem(item.id)}
                className="w-8 h-8 flex items-center justify-center absolute top-2 right-2 rounded-full bg-red-500/80 text-white cursor-pointer hover:bg-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
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
            </div>
            <div className="relative h-[150px] overflow-hidden">
                <img
                    src={item.bannerable.thumbnail}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.bannerable.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            </div>
            <div className="p-4 relative">
                <h1 className="text-lg font-bold text-white line-clamp-1 mb-1">
                    {item?.bannerable?.name}
                </h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                    {item?.bannerable?.type}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {item?.bannerable?.tags.slice(0, 3).map((tag) => (
                        <Tag
                            tag={tag}
                            className={
                                "!bg-white/5 !text-zinc-300 !text-[10px] !px-2 !py-0.5 border border-white/5"
                            }
                            key={tag.id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Index = ({ banners, allBanners }) => {
    const [items, setItems] = useState(
        banners.map((banner, index) => ({ id: index + 1, ...banner }))
    );
    const [bannerOptions, setBannerOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    useEffect(() => {
        setBannerOptions(
            allBanners
                .filter((banner) => {
                    return !items.find(
                        (item) =>
                            item.bannerable.type === banner.type &&
                            item.bannerable.id === banner.id
                    );
                })
                .map((banner) => {
                    return {
                        value: {
                            id: banners.length + 1,
                            bannerable: banner,
                        },
                        label: banner.name,
                    };
                })
        );
    }, [items]);

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

    const handleClose = () => setOpen(false);

    const handleUpdate = () => {
        router.post(window.route("group.admin.banners.update"), {
            banners: items,
        });
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen p-8 text-white">
            <Modal
                open={open}
                onClose={handleClose}
                disableAutoFocus
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50 rounded-2xl p-6 focus:outline-none">
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="!font-black !text-white !text-center !mb-6 !tracking-tight"
                    >
                        Select Banner Content
                    </Typography>
                    <div className="mt-5">
                        <Select
                            label={"Content"}
                            options={bannerOptions}
                            onChange={(banner) =>
                                setSelectedBanner(banner.value)
                            }
                        />
                    </div>
                    <Button
                        variant="contained"
                        disabled={!selectedBanner}
                        onClick={() => {
                            setItems((prev) => [...prev, selectedBanner]);
                            setOpen(false);
                        }}
                        className="!bg-primary !w-full !mt-6 !py-3 !rounded-xl !font-bold !normal-case !shadow-lg !shadow-primary/20 hover:!bg-primary/90 disabled:!bg-zinc-800 disabled:!text-zinc-600"
                    >
                        Add to Banners
                    </Button>
                </Box>
            </Modal>

            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(237,100,0,0.15)]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-primary"
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
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                            Banners Management
                        </h1>
                        <p className="text-zinc-400 text-sm font-medium mt-1">
                            Drag and drop to reorder your homepage banners
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="contained"
                        className="!bg-primary hover:!bg-primary/90 !w-12 !h-12 !min-w-0 !rounded-xl !font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
                        onClick={() => setOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
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
                        className="!bg-primary hover:!bg-primary/90 !px-8 !py-3 !h-12 !rounded-xl !font-bold !text-sm !normal-case shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
                        onClick={handleUpdate}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <DndProvider backend={HTML5Backend}>
                <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 border border-white/5 bg-[#1a1a1a]/50 min-h-[300px] p-6 rounded-3xl gap-6 shadow-inner">
                    {items.length > 0 ? (
                        items.map((item, index) => (
                            <DraggableBanner
                                key={item.bannerable.slug}
                                item={item}
                                index={index}
                                moveItem={moveItem}
                                removeItem={removeItem}
                            />
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 h-[250px]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 mb-4 opacity-20"
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
                            <p className="text-lg font-bold opacity-50">
                                No banners added yet
                            </p>
                            <p className="text-sm">
                                Click the + button to add content
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
