import UserLayout from "@/Layouts/UserLayout";
import React, { useEffect, useState } from "react";
import SaveListIcon from "@/../assets/SaveList";
import SectionContainer from "@/Components/SectionContainer";
import SaveItemCard from "@/Components/SaveItemCard";
import { Link } from "@inertiajs/react";
import { getQueryParam } from "@/helpers/getQueryParams";
import { usePage } from "@inertiajs/react";

const SaveList = ({ collections }) => {
    const [activeTab, setActiveTab] = useState("");
    const [collectionItems, setCollectionItems] = useState([]);
    const [collection, setCollection] = useState(null);
    const { url } = usePage();
    useEffect(() => {
        const tab = getQueryParam(url, "tab") || collections[0].name;
        setActiveTab(tab);
        const collection = collections?.find(
            (collection) => collection.name === tab
        );
        setCollection(collection);
        setCollectionItems(collection?.collection_items || []);
    }, [collections]);
    return (
        <SectionContainer className="min-h-screen bg-white py-10 dark:bg-black">
            <div className="mx-auto w-[90%]">
                {/* Header */}
                <div className="mb-12 flex items-center gap-4 border-b border-zinc-200 pb-6 dark:border-white/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                        <SaveListIcon className={"h-6 w-6 text-primary"} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        My Lists
                    </h1>
                </div>

                {/* Tabs */}
                <div className="mb-10 overflow-x-auto">
                    <div className="flex w-fit items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-100 p-1.5 dark:border-white/10 dark:bg-[#1a1a1a]">
                        {collections.map((collection) => (
                            <Link
                                href={window.route("group.savelist", {
                                    tab: collection.name,
                                })}
                                key={collection.id}
                            >
                                <div
                                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 sm:px-8 sm:py-3 sm:text-sm ${
                                        activeTab === collection.name
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                                    }`}
                                >
                                    {collection.name}
                                </div>
                            </Link>
                        ))}
                        <Link
                            href={window.route("group.savelist", {
                                tab: "history",
                            })}
                        >
                            <div
                                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 sm:px-8 sm:py-3 sm:text-sm ${
                                    activeTab === "history"
                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                        : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                                }`}
                            >
                                History
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div>
                    {collectionItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {collectionItems.map((item) => (
                                <div key={item.id} className="h-full">
                                    <SaveItemCard
                                        itemId={item.id}
                                        collectionId={collection.id}
                                        type={
                                            item?.item_type ===
                                            "App\\Models\\Anime"
                                                ? "anime"
                                                : "manga"
                                        }
                                        item={item.item}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 py-32 dark:border-white/5 dark:bg-[#1a1a1a]/30">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-white/5 dark:text-zinc-600">
                                <SaveListIcon className="h-10 w-10" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                                No Items Saved
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-500">
                                Items you add to your {activeTab} will appear
                                here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </SectionContainer>
    );
};

export default SaveList;
SaveList.layout = (page) => <UserLayout>{page}</UserLayout>;
