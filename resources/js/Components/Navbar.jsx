import React, { useCallback, useEffect, useRef, useState } from "react";
import LogoImg from "../../assets/logo.png";
import Close from "../../assets/Close";
import SectionContainer from "./SectionContainer";
import { Link, router, usePage } from "@inertiajs/react";
import Button from "./Button";
import { useDebounce } from "@uidotdev/usehooks";
import axios from "axios";
import { useDetectClickOutside } from "react-detect-click-outside";
import Modal from "./Modal";
import Logo from "./Logo";
import VideoUploadNotification from "./Notifications/VideoUploadNotification";

const Navbar = () => {
    const {
        component,
        props: { auth },
    } = usePage();
    const [search, setSearch] = useState("");
    const [animes, setAnimes] = useState([]);
    const decounceSearch = useDebounce(search, 300);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] =
        useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isOpenMobileNavbar, setIsOpenMobileNavbar] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const scrollRef = useRef(null);
    const mobileSearchInputRef = useRef(null);

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    // Focus input when mobile search opens
    useEffect(() => {
        if (isMobileSearchOpen && mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
        }
    }, [isMobileSearchOpen]);

    const handleCallback = useCallback((el) => {
        if (!el) {
            if (scrollRef.current) {
                scrollRef.current.disconnect();
            }
            return;
        }
        scrollRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    !isLoading &&
                    nextPageUrl !== null &&
                    !isFirstRender
                ) {
                    setIsLoading(true);
                    axios
                        .get(nextPageUrl + "&userId=" + auth.user.id)
                        .then((res) => {
                            setNotifications((prev) => [
                                ...prev,
                                ...res.data.notifications.data,
                            ]);

                            setNextPageUrl(
                                res.data.notifications.next_page_url
                            );
                            setIsLoading(false);
                        });
                }
            });
        });
        scrollRef.current.observe(el);
    });

    const closeSearchModal = () => {
        setSearch("");
        setSearchModalOpen(false);
    };

    const fetchNotifications = async () => {
        const response = await axios.get(
            window.route("group.notis", { userId: auth?.user?.id })
        );
        setNotifications(response.data.notifications.data);
        setNextPageUrl(response.data.notifications.next_page_url);
    };

    useEffect(() => {
        if (auth.user) {
            fetchNotifications();
        }
    }, []);

    const handleClickOutside = (e) => {
        if (e.target.parentNode.classList.contains("profile-container")) return;
        setIsProfileOpen(false);
    };
    const profileRef = useDetectClickOutside({
        onTriggered: handleClickOutside,
    });
    const notificationRef = useRef();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.parentNode.classList.contains("notification-icon"))
                return;
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target)
            ) {
                setIsNotificationModalOpen(false);
            }
            return;
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [notificationRef]);
    const ref = useDetectClickOutside({ onTriggered: closeSearchModal });
    const handleSearch = async () => {
        setSearchModalOpen(true);
        let response = await axios.get(
            window.route("group.search", { search })
        );
        setAnimes(response?.data?.animes?.data);
    };
    useEffect(() => {
        if (decounceSearch) {
            handleSearch();
        } else {
            setAnimes([]);
        }
    }, [decounceSearch]);

    const MobileNavLink = ({ href, active, children, icon, onClick }) => (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                active
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
        >
            <div
                className={`p-1.5 rounded-lg transition-colors ${
                    active
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                }`}
            >
                {React.cloneElement(icon, { width: 18, height: 18 })}
            </div>
            <span className="font-medium text-sm">{children}</span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary/50" />
            )}
        </Link>
    );

    return (
        <>
            <SectionContainer className="sticky top-0 z-[100] w-full bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between h-20 transition-all duration-300">
                {/* Logo */}
                <div className="w-16 h-16 shrink-0 relative z-50 hover:scale-105 transition-transform duration-300">
                    <Logo logo={LogoImg} />
                </div>

                {/* Desktop Search */}
                <div className="hidden md:block relative w-[350px] lg:w-[450px]">
                    <div className="relative group">
                        <label
                            htmlFor="search"
                            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                width="20"
                                height="20"
                                viewBox="0 0 30 30"
                            >
                                <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                            </svg>
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoComplete="off"
                            id="search"
                            placeholder="Search Anime..."
                            className="bg-zinc-900/50 text-white w-full rounded-full py-2.5 pl-12 pr-4 border border-white/10 outline-none focus:border-primary/50 focus:bg-zinc-900 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-zinc-600 font-medium text-sm"
                        />
                    </div>
                    {animes.length > 0 && searchModalOpen && (
                        <div
                            ref={ref}
                            className="absolute overflow-hidden left-0 right-0 mt-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="p-2 space-y-1">
                                {animes?.map((anime) => (
                                    <Link
                                        key={anime?.id}
                                        href={window.route(
                                            "group.anime.detail",
                                            {
                                                anime,
                                            }
                                        )}
                                        onSuccess={() => {
                                            setSearchModalOpen(false);
                                            setSearch("");
                                        }}
                                        className="block rounded-xl overflow-hidden hover:bg-white/5 transition-colors group/item"
                                    >
                                        <div className="flex gap-4 items-center p-3">
                                            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden shadow-sm relative">
                                                <img
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                    src={anime?.thumbnail}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h1 className="font-semibold text-sm text-gray-100 truncate group-hover/item:text-primary transition-colors">
                                                    {anime?.name}
                                                </h1>
                                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                                    {anime?.description}
                                                </p>
                                                <div className="flex mt-2 items-center gap-4 text-xs font-medium text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            className="text-gray-400"
                                                        >
                                                            <path
                                                                fill="currentColor"
                                                                d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"
                                                            />
                                                        </svg>
                                                        <span>
                                                            {anime?.views_count}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-primary font-bold">
                                                            {anime?.rating}
                                                        </span>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 14 14"
                                                            className="text-primary"
                                                        >
                                                            <path
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M7.49 1.09L9.08 4.3a.51.51 0 0 0 .41.3l3.51.52a.54.54 0 0 1 .3.93l-2.53 2.51a.53.53 0 0 0-.16.48l.61 3.53a.55.55 0 0 1-.8.58l-3.16-1.67a.59.59 0 0 0-.52 0l-3.16 1.67a.55.55 0 0 1-.8-.58L3.39 9a.53.53 0 0 0-.16-.48L.67 6.05A.54.54 0 0 1 1 5.12l3.51-.52a.51.51 0 0 0 .41-.3l1.59-3.21a.54.54 0 0 1 .98 0Z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                <div className="p-2 border-t border-white/5 text-center">
                                    <Link
                                        onSuccess={() => {
                                            setSearchModalOpen(false);
                                            setSearch("");
                                        }}
                                        href={window.route("group.animes")}
                                        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Show More Results...
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="md:block hidden">
                    <ul className="flex items-center gap-8 font-medium text-gray-300 text-sm">
                        <li
                            className={`hover:text-primary transition-colors duration-200 ${
                                component === "Group/Index"
                                    ? "text-primary"
                                    : null
                            }`}
                        >
                            <Link href={window.route("group.home")}>Home</Link>
                        </li>
                        <li
                            className={`hover:text-primary transition-colors duration-200 ${
                                component === "Group/Animes"
                                    ? "text-primary"
                                    : null
                            }`}
                        >
                            <Link href={window.route("group.animes")}>
                                Animes
                            </Link>
                        </li>
                        <li
                            className={`hover:text-primary transition-colors duration-200 ${
                                component === "Group/SaveList"
                                    ? "text-primary"
                                    : null
                            }`}
                        >
                            <Link href={window.route("group.savelist")}>
                                SaveList
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="md:hidden flex items-center gap-2">
                    <button
                        onClick={() => setIsMobileSearchOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                    <button
                        onClick={() => setIsOpenMobileNavbar((prev) => !prev)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="4" y1="6" x2="20" y2="6"></line>
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <line x1="4" y1="18" x2="20" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="xl:block hidden">
                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsNotificationModalOpen((prev) => !prev);
                                }}
                                className="relative notification-icon cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors group"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="group-hover:text-primary transition-colors text-white"
                                    fill="currentColor"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                                </svg>
                                {/* Notification Badge if needed */}
                                {notifications.length > 0 &&
                                    notifications.some((n) => !n.read_at) && (
                                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></div>
                                    )}
                            </div>
                            <div className="relative w-0 h-[20px]">
                                <div
                                    ref={notificationRef}
                                    className={`absolute bg-white top-[180%] -right-20 w-[400px] h-[500px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 origin-top-right border border-gray-100 z-[100] ${
                                        isNotificationModalOpen
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-4"
                                    }`}
                                >
                                    <div className="h-full flex flex-col">
                                        <div className="flex py-4 px-4 items-center justify-between border-b border-gray-100 bg-gray-50/50">
                                            <h1 className="text-lg font-bold text-gray-800">
                                                Notifications
                                            </h1>
                                            <p
                                                className={
                                                    "cursor-pointer text-xs font-semibold text-primary hover:text-primary/80 hover:underline"
                                                }
                                            >
                                                Mark all read
                                            </p>
                                        </div>
                                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                                            {notifications.map((notification) =>
                                                notification.notifiable_type ===
                                                "App\\Models\\User" ? (
                                                    <VideoUploadNotification
                                                        key={notification.id}
                                                        notification={
                                                            notification
                                                        }
                                                    />
                                                ) : null
                                            )}
                                            <button
                                                className="opacity-0 w-full h-4"
                                                ref={handleCallback}
                                            >
                                                More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    setIsProfileOpen((prev) => !prev);
                                }}
                                className="w-10 h-10 profile-container relative cursor-pointer rounded-full ring-2 ring-transparent hover:ring-primary transition-all duration-300"
                            >
                                <img
                                    src={auth?.user?.profile_picture}
                                    className="w-full h-full rounded-full object-cover"
                                />
                                {isProfileOpen && (
                                    <div
                                        ref={profileRef}
                                        className="absolute bg-zinc-900 border border-white/10 text-white rounded-xl shadow-2xl w-60 top-[140%] right-0 overflow-hidden py-1 z-[100]"
                                    >
                                        <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                                            <p className="text-sm font-semibold text-white">
                                                {auth.user.name}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                        {auth?.user?.role?.name === "admin" && (
                                            <Link
                                                href={window.route(
                                                    "group.admin.dashboard"
                                                )}
                                            >
                                                <div className="flex hover:bg-primary hover:text-white items-center px-4 py-3 gap-3 transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                                                        />
                                                    </svg>
                                                    <p className="text-sm font-medium">
                                                        Dashboard
                                                    </p>
                                                </div>
                                            </Link>
                                        )}
                                        <Link
                                            href={window.route(
                                                "group.user.profile"
                                            )}
                                        >
                                            <div className="flex hover:bg-primary hover:text-white items-center px-4 py-3 gap-3 transition-colors">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 11q.825 0 1.413-.588Q14 9.825 14 9t-.587-1.413Q12.825 7 12 7q-.825 0-1.412.587Q10 8.175 10 9q0 .825.588 1.412Q11.175 11 12 11Zm0 2q-1.65 0-2.825-1.175Q8 10.65 8 9q0-1.65 1.175-2.825Q10.35 5 12 5q1.65 0 2.825 1.175Q16 7.35 16 9q0 1.65-1.175 2.825Q13.65 13 12 13Zm0 11q-2.475 0-4.662-.938q-2.188-.937-3.825-2.574Q1.875 18.85.938 16.663Q0 14.475 0 12t.938-4.663q.937-2.187 2.575-3.825Q5.15 1.875 7.338.938Q9.525 0 12 0t4.663.938q2.187.937 3.825 2.574q1.637 1.638 2.574 3.825Q24 9.525 24 12t-.938 4.663q-.937 2.187-2.574 3.825q-1.638 1.637-3.825 2.574Q14.475 24 12 24Zm0-2q1.8 0 3.375-.575T18.25 19.8q-.825-.925-2.425-1.612q-1.6-.688-3.825-.688t-3.825.688q-1.6.687-2.425 1.612q1.3 1.05 2.875 1.625T12 22Zm-7.7-3.6q1.2-1.3 3.225-2.1q2.025-.8 4.475-.8q2.45 0 4.463.8q2.012.8 3.212 2.1q1.1-1.325 1.713-2.95Q22 13.825 22 12q0-2.075-.788-3.887q-.787-1.813-2.15-3.175q-1.362-1.363-3.175-2.151Q14.075 2 12 2q-2.05 0-3.875.787q-1.825.788-3.187 2.151Q3.575 6.3 2.788 8.113Q2 9.925 2 12q0 1.825.6 3.463q.6 1.637 1.7 2.937Z"
                                                    />
                                                </svg>
                                                <p className="text-sm font-medium">
                                                    Profile
                                                </p>
                                            </div>
                                        </Link>
                                        <div
                                            onClick={() =>
                                                setLogoutModalOpen(
                                                    (prev) => !prev
                                                )
                                            }
                                            className="flex hover:bg-red-500 hover:text-white cursor-pointer items-center px-4 py-3 gap-3 transition-colors"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M6 2h9a2 2 0 0 1 2 2v2h-2V4H6v16h9v-2h2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M16.09 15.59L17.5 17l5-5l-5-5l-1.41 1.41L18.67 11H9v2h9.67z"
                                                />
                                            </svg>
                                            <span className="text-sm font-medium">
                                                Logout
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button
                                text={"Sign In"}
                                className={
                                    "!bg-transparent !border-primary !border text-primary hover:!bg-primary hover:!text-white transition-all px-8 py-2 rounded-full font-semibold"
                                }
                                href={window.route("group.login")}
                            />
                            <Button
                                text={"Sign Up"}
                                className={
                                    "!bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all px-8 py-2 rounded-full font-semibold"
                                }
                                href={window.route("group.register")}
                            />
                        </div>
                    )}
                </div>
            </SectionContainer>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 z-[120] md:hidden transition-all duration-300 ${
                    isOpenMobileNavbar ? "visible" : "invisible delay-300"
                }`}
            >
                {/* Backdrop */}
                <div
                    onClick={() => setIsOpenMobileNavbar(false)}
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                        isOpenMobileNavbar ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Drawer Content */}
                <div
                    className={`absolute right-0 top-0 h-full w-[85%] max-w-[360px] bg-zinc-950 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
                        isOpenMobileNavbar
                            ? "translate-x-0"
                            : "translate-x-full"
                    }`}
                >
                    {/* Header */}
                    <div className="p-6 flex items-center justify-between border-b border-white/5">
                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <img
                                    src={auth.user.profile_picture}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50 p-0.5"
                                    alt="Profile"
                                />
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white leading-none truncate">
                                        {auth.user.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-1.5 truncate max-w-[150px]">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-12 h-12">
                                <Logo logo={LogoImg} />
                            </div>
                        )}
                        <div
                            onClick={() => setIsOpenMobileNavbar(false)}
                            className="w-10 h-10 cursor-pointer rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-primary transition-all active:scale-95 text-gray-300"
                        >
                            <Close className={"w-5 h-5"} />
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                        <MobileNavLink
                            href={window.route("group.home")}
                            active={component === "Group/Index"}
                            onClick={() => setIsOpenMobileNavbar(false)}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            }
                        >
                            Home
                        </MobileNavLink>

                        <MobileNavLink
                            href={window.route("group.animes")}
                            active={component === "Group/Animes"}
                            onClick={() => setIsOpenMobileNavbar(false)}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                            }
                        >
                            Anime List
                        </MobileNavLink>

                        <MobileNavLink
                            href="/"
                            active={component === "Group/NewSeason"}
                            onClick={() => setIsOpenMobileNavbar(false)}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect
                                        x="3"
                                        y="4"
                                        width="18"
                                        height="18"
                                        rx="2"
                                        ry="2"
                                    ></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            }
                        >
                            New Season
                        </MobileNavLink>

                        <MobileNavLink
                            href="/"
                            active={component === "Group/Popular"}
                            onClick={() => setIsOpenMobileNavbar(false)}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                                </svg>
                            }
                        >
                            Popular
                        </MobileNavLink>

                        <MobileNavLink
                            href={window.route("group.savelist")}
                            active={component === "Group/SaveList"}
                            onClick={() => setIsOpenMobileNavbar(false)}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            }
                        >
                            SaveList
                        </MobileNavLink>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                        {auth.user ? (
                            <div className="space-y-3">
                                {/* Admin Dashboard */}
                                {auth?.user?.role?.name === "admin" && (
                                    <Link
                                        href={window.route(
                                            "group.admin.dashboard"
                                        )}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-gray-300 hover:bg-primary hover:text-white transition-all duration-300 font-semibold"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
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
                                                width="7"
                                                height="7"
                                            ></rect>
                                            <rect
                                                x="14"
                                                y="3"
                                                width="7"
                                                height="7"
                                            ></rect>
                                            <rect
                                                x="14"
                                                y="14"
                                                width="7"
                                                height="7"
                                            ></rect>
                                            <rect
                                                x="3"
                                                y="14"
                                                width="7"
                                                height="7"
                                            ></rect>
                                        </svg>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setIsOpenMobileNavbar(false);
                                        setLogoutModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-semibold"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line
                                            x1="21"
                                            y1="12"
                                            x2="9"
                                            y2="12"
                                        ></line>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Button
                                    text="Sign In"
                                    className="!bg-transparent !border-primary !border text-primary hover:!bg-primary hover:!text-white transition-all w-full justify-center py-3 rounded-xl font-bold"
                                    href={window.route("group.login")}
                                />
                                <Button
                                    text="Sign Up"
                                    className="!bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all w-full justify-center py-3 rounded-xl font-bold"
                                    href={window.route("group.register")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-zinc-950/95 backdrop-blur-3xl transition-all duration-300 ${
                    isMobileSearchOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-4"
                } md:hidden flex flex-col`}
            >
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <div
                        onClick={() => {
                            setIsMobileSearchOpen(false);
                            setSearch("");
                        }}
                        className="text-white p-2 -ml-2 rounded-full hover:bg-white/10"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="flex-1 relative">
                        <input
                            ref={mobileSearchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Anime..."
                            className="w-full bg-zinc-900 text-white rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                        {search && (
                            <div
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
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
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {search && animes.length === 0 && !decounceSearch ? (
                        <div className="text-center text-gray-400 mt-10">
                            No results found for "{search}"
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {animes?.map((anime) => (
                                <Link
                                    key={anime?.id}
                                    href={window.route("group.anime.detail", {
                                        anime,
                                    })}
                                    onSuccess={() => {
                                        setIsMobileSearchOpen(false);
                                        setSearch("");
                                    }}
                                    className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 active:bg-white/10"
                                >
                                    <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={anime?.thumbnail}
                                            alt={anime?.name}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate text-base mb-1">
                                            {anime?.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    className="text-gray-500"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"
                                                    />
                                                </svg>
                                                <span>
                                                    {anime?.views_count}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    className="text-primary"
                                                >
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M7.49 1.09L9.08 4.3a.51.51 0 0 0 .41.3l3.51.52a.54.54 0 0 1 .3.93l-2.53 2.51a.53.53 0 0 0-.16.48l.61 3.53a.55.55 0 0 1-.8.58l-3.16-1.67a.59.59 0 0 0-.52 0l-3.16 1.67a.55.55 0 0 1-.8-.58L3.39 9a.53.53 0 0 0-.16-.48L.67 6.05A.54.54 0 0 1 1 5.12l3.51-.52a.51.51 0 0 0 .41-.3l1.59-3.21a.54.54 0 0 1 .98 0Z"
                                                    />
                                                </svg>
                                                <span className="text-primary font-bold">
                                                    {anime?.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {animes.length > 0 && (
                        <div className="mt-4 text-center">
                            <Link
                                onSuccess={() => {
                                    setIsMobileSearchOpen(false);
                                    setSearch("");
                                }}
                                href={window.route("group.animes")}
                                className="inline-block py-2.5 px-8 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                View All Results
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Modal */}
            {logoutModalOpen && (
                <Modal
                    className={"z-[100] bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"}
                >
                    <h1 className="text-xl font-bold mb-2">Logout</h1>
                    <p className="font-medium text-gray-600 mb-6">
                        Are you sure want to logout.
                    </p>
                    <div className="w-[80%] space-y-3">
                        <Button
                            type={"button"}
                            onClick={() => setLogoutModalOpen(false)}
                            className={
                                "!text-black w-full border border-gray-300 hover:bg-gray-50"
                            }
                            outline
                            text={"Cancel"}
                        />
                        <Button
                            type={"button"}
                            onClick={() => {
                                router.post(
                                    window.route("group.logout"),
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setLogoutModalOpen(false);
                                        },
                                    }
                                );
                            }}
                            className={
                                "!bg-red-500 w-full hover:!bg-red-600 shadow-lg shadow-red-500/30"
                            }
                            text={"Logout"}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Navbar;
