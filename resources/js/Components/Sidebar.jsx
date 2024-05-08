import React from "react";
import RightArrow from "@/../assets/RightArrow";
import Dashboard from "@/../assets/Dashboard";
import { Link, usePage } from "@inertiajs/react";

const Sidebar = ({sidebarLinks}) => {
    const { group } = usePage().props;
    return (
        <div className="fixed top-0 left-0 bottom-0 lg:w-[20%] w-[30%] min-h-full overflow-y-auto border-r-[1px]  border-r-gray-300">
            <div className="flex flex-col justify-between">
                <div>
                    <div className="flex p-5 items-center gap-4 border-b-[1px] border-b-[rgba(0,0,0,0.1)]">
                        <div className="w-[50px] h-[50px]">
                            <img
                                src={group?.logo}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium">
                                {group?.name}
                            </h2>
                            <p className="text-gray-500 text-sm font-medium">
                                Group
                            </p>
                        </div>
                    </div>
                    <div className="border-b-[1px] pb-5 border-b-[rgba(0,0,0,0.1)]">
                        <div className="">
                            <p className="text-gray-600 py-5 pl-5 font-semibold text-xs uppercase">
                                OverView
                            </p>
                            <div className="pl-1">
                                {sidebarLinks.map((link) =>
                                    link.children?.length > 0 ? (
                                        <div className="pl-5" key={link.name}>
                                            <div className="flex  py-4 rounded-tl-md rounded-bl-md hover:bg-[rgba(0,0,0,0.1)] cursor-pointer items-center gap-1">
                                                <div>
                                                    <RightArrow
                                                        className={"w-6 h-6"}
                                                    />
                                                </div>
                                                <div className="flex  items-center gap-2">
                                                    {link.icon}
                                                    <p className="font-semibold">
                                                        {link.name}
                                                    </p>
                                                </div>
                                            </div>
                                            {link?.children?.length && (
                                                <div className="bg-gray-100 rounded-tl-lg rounded-bl-lg">
                                                    {link.children.map(
                                                        (childLink) => (
                                                            <Link
                                                                href={window.route(
                                                                    childLink.routeName
                                                                )}
                                                                key={
                                                                    childLink.name
                                                                }
                                                                className="flex pl-7 rounded-tl-lg rounded-bl-lg cursor-pointer hover:bg-[rgba(0,0,0,0.1)] py-4 items-center gap-2"
                                                            >
                                                                <p className="font-semibold">
                                                                    {
                                                                        childLink.name
                                                                    }
                                                                </p>
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            className="block pl-5"
                                            key={link.name}
                                            href={window.route(link.routeName)}
                                        >
                                            <div className="flex  py-4 rounded-tl-md rounded-bl-md hover:bg-[rgba(0,0,0,0.1)] cursor-pointer items-center gap-1">
                                                <div className="flex ml-2 items-center gap-2">
                                                    {link.icon}
                                                    <p className="font-semibold">
                                                        {link.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-gray-600 py-5 pl-5 font-semibold text-xs uppercase">
                        Account
                    </p>
                    <div className="pl-1 mb-3">
                        <div className="flex rounded-tl-md rounded-bl-md hover:bg-[rgba(0,0,0,0.1)] pl-5 py-4 cursor-pointer items-center gap-2">
                            <Dashboard className="w-5 h-5" />
                            <p className="font-semibold">Dashboard</p>
                        </div>
                        <div className="flex pl-5 rounded-tl-md rounded-bl-md hover:bg-[rgba(0,0,0,0.1)] py-4 cursor-pointer items-center gap-2">
                            <Dashboard className={"w-5 h-5"} />
                            <p className="font-semibold">Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
