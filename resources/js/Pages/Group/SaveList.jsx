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
        <SectionContainer className={"bg-black min-h-screen py-10"}>
            <div className="w-[90%] mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <SaveListIcon className={"w-6 h-6 text-primary"} />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        My Lists
                    </h1>
                </div>

                {/* Tabs */}
                <div className="mb-10 overflow-x-auto">
                    <div className="flex items-center gap-2 p-1.5 bg-[#1a1a1a] border border-white/10 rounded-2xl w-fit">
                        {collections.map((collection) => (
                            <Link
                                href={window.route("group.savelist", {
                                    tab: collection.name,
                                })}
                                key={collection.id}
                            >
                                <div
                                    className={`px-8 py-3 rounded-xl transition-all duration-300 font-bold text-sm whitespace-nowrap ${
                                        activeTab === collection.name
                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5"
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
                                className={`px-8 py-3 rounded-xl transition-all duration-300 font-bold text-sm whitespace-nowrap ${
                                    activeTab === "history"
                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-[#1a1a1a]/30 border border-white/5 border-dashed">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-600">
                                <SaveListIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                No Items Saved
                            </h3>
                            <p className="text-zinc-500">
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
