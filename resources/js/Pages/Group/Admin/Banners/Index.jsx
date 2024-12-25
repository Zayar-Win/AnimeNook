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
            className="bg-gray-200 relative pb-2 min-h-[200px] rounded"
        >
            <div
                onClick={() => removeItem(item.id)}
                className="w-[25px] flex items-center justify-center absolute right-[-20px] translate-x-[-50%] translate-y-[-50%] h-[25px] rounded-full bg-red-500 text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                >
                    <path
                        fill="currentColor"
                        d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z"
                    />
                </svg>
            </div>
            <img
                src={item.bannerable.thumbnail}
                className="w-full h-[150px] object-cover"
            />
            <div className="p-2">
                <h1 className="text-lg font-semibold">
                    {item?.bannerable?.name}
                </h1>
                <p className="text-sm font-medium text-gray-600">
                    Type : {item?.bannerable?.type}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {item?.bannerable?.tags.map((tag) => (
                        <Tag tag={tag} className={"bg-primary"} key={tag.id} />
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
        <div className="pr-5 mb-[50px]">
            <Modal
                open={open}
                onClose={handleClose}
                disableAutoFocus
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    style={style}
                    className="px-5 rounded-lg min-h-[300px]  py-3"
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                        Select Your Banner
                    </Typography>
                    <div className="mt-5">
                        <Select
                            label={"Banners"}
                            options={bannerOptions}
                            onChange={(banner) =>
                                setSelectedBanner(banner.value)
                            }
                        />
                    </div>
                    <Button
                        variant="contained"
                        sx={{ marginTop: "20px" }}
                        disabled={!selectedBanner}
                        onClick={() => {
                            setItems((prev) => [...prev, selectedBanner]);
                            setOpen(false);
                        }}
                        className="!bg-primary !disabled:cursor-not-allowed  !min-w-[150px]"
                    >
                        Add
                    </Button>
                </Box>
            </Modal>
            <h1 className="text-center text-xl font-bold my-10">
                Banners Management
            </h1>
            <div className="flex justify-end mb-3 mt-4">
                <Button
                    variant="contained"
                    sx={{ fontSize: "16px" }}
                    className="!bg-primary"
                    onClick={() => setOpen(true)}
                >
                    +
                </Button>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 border-[1px] border-black/20 min-h-[200px] px-3 py-3 rounded-lg gap-4">
                    {items.map((item, index) => (
                        <DraggableBanner
                            key={item.bannerable.slug}
                            item={item}
                            index={index}
                            moveItem={moveItem}
                            removeItem={removeItem}
                        />
                    ))}
                </div>
            </DndProvider>
            <div className="mt-10">
                <Button
                    variant="contained"
                    sx={{ minWidth: "200px", fontWeight: "bold" }}
                    className="!bg-primary"
                    onClick={handleUpdate}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default Index;
Index.layout = (page) => <GroupAdminLayout>{page}</GroupAdminLayout>;
