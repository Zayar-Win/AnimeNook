import React from "react";
import SectionContainer from "./SectionContainer";
import { Link, usePage } from "@inertiajs/react";
import LogoImg from "../../assets/logo.png";
import Logo from "./Logo";

const FooterLink = ({ href, children }) => (
    <li>
        <Link
            href={href}
            className="inline-block text-[15px] font-medium text-zinc-600 transition-all duration-300 hover:pl-2 hover:text-primary dark:text-zinc-400"
        >
            {children}
        </Link>
    </li>
);

const SocialLink = ({ href, icon, colorClass }) => (
    <a
        href={href}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/80 text-zinc-600 transition-all duration-300 dark:bg-white/5 dark:text-zinc-400 ${colorClass} hover:-translate-y-1 hover:text-zinc-900 dark:hover:text-white`}
    >
        {icon}
    </a>
);

const Footer = () => {
    const { group } = usePage().props;
    const footerLogo =
        group?.group_setting?.logo || group?.groupSetting?.logo || group?.logo || LogoImg;

    return (
        <SectionContainer
            padding={false}
            className="relative overflow-hidden border-t border-zinc-200 bg-white dark:border-white/5 dark:bg-[#050505]"
        >
            {/* Ambient Background */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column - Spans 5 columns */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-3">
                            <Logo logo={footerLogo} className="!w-12 h-auto" />
                            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                                AnimeNook
                            </span>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Your ultimate destination for anime streaming. Join
                            our community and explore thousands of titles in HD
                            quality.
                        </p>

                        <div className="flex flex-wrap gap-3 pt-2">
                            {/* Youtube */}
                            <SocialLink
                                href={
                                    group.group_setting.social_links["youtube"]
                                }
                                colorClass="hover:bg-[#FF0000]"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                }
                            />
                            {/* Facebook */}
                            <SocialLink
                                href={
                                    group.group_setting.social_links["facebook"]
                                }
                                colorClass="hover:bg-[#1877F2]"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                }
                            />
                            {/* TikTok */}
                            <SocialLink
                                href={group.group_setting.social_links["titok"]}
                                colorClass="hover:bg-black hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                }
                            />
                            {/* Telegram */}
                            <SocialLink
                                href={
                                    group.group_setting.social_links["telegram"]
                                }
                                colorClass="hover:bg-[#0088cc]"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.697.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.75-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>

                    {/* Navigation - Spans 4 cols */}
                    <div className="lg:col-span-4 lg:col-start-7">
                        <h3 className="mb-6 text-lg font-bold text-zinc-900 dark:text-white">
                            Explore
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <FooterLink href={window.route("group.home")}>
                                Home
                            </FooterLink>
                            <FooterLink href={window.route("group.savelist")}>
                                Watchlist
                            </FooterLink>
                            <FooterLink
                                href={window.route("group.animes", {
                                    sort: "popularity",
                                })}
                            >
                                Most Popular
                            </FooterLink>
                            <FooterLink href={window.route("group.animes")}>
                                Manga List
                            </FooterLink>
                            <FooterLink
                                href={window.route("group.animes", {
                                    sort: "newest",
                                })}
                            >
                                New Releases
                            </FooterLink>
                        </ul>
                    </div>

                    {/* Account - Spans 2 cols */}
                    <div className="lg:col-span-2">
                        <h3 className="mb-6 text-lg font-bold text-zinc-900 dark:text-white">
                            Account
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink href={window.route("group.login")}>
                                Sign In
                            </FooterLink>
                            <FooterLink href={window.route("group.register")}>
                                Register
                            </FooterLink>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-white/5 md:flex-row">
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                        © {new Date().getFullYear()} AnimeNook. All rights
                        reserved.
                    </p>
                    <p className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-600">
                        Developed by{" "}
                        <span className="cursor-pointer font-medium text-zinc-700 transition-colors hover:text-primary dark:text-zinc-400 dark:hover:text-white">
                            Zayarwin
                        </span>
                    </p>
                </div>
            </div>
        </SectionContainer>
    );
};

export default Footer;
