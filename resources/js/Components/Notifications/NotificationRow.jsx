import React from "react";
import { format } from "timeago.js";

const typeMeta = (type) => {
    switch (type) {
        case "new_manga_chapter":
            return { badge: "Manga", headline: "New chapter" };
        case "saved_content_update":
            return { badge: "Saved", headline: "Saved list" };
        case "comment_reply":
            return { badge: "Reply", headline: "Comment" };
        case "comment_mention":
            return { badge: "Mention", headline: "Comment" };
        case "admin_new_user":
            return { badge: "Admin", headline: "Members" };
        case "admin_new_comment":
            return { badge: "Admin", headline: "Moderation" };
        case "new_anime_episode":
        default:
            return { badge: "Anime", headline: "New episode" };
    }
};

const isMediaChapterType = (type) =>
    type === "new_anime_episode" ||
    type === "new_manga_chapter" ||
    type === "saved_content_update" ||
    !type;

const NotificationRow = ({ notification, onMarkRead }) => {
    const d = notification?.data || {};
    const type = d.notification_type || "new_anime_episode";
    const { badge, headline } = typeMeta(type);
    const unread = !notification.read_at;

    const mediaStyle = isMediaChapterType(type);
    const primary = mediaStyle
        ? d.name || headline
        : d.title || d.name || headline;
    const secondary = mediaStyle
        ? d.title
        : d.subtitle || (d.name && d.name !== primary ? d.name : null);

    const link = d.link;
    const thumb = d.thumbnail;

    const handleClick = async (e) => {
        e.preventDefault();
        if (!link) return;
        if (!notification.read_at && onMarkRead) {
            await onMarkRead(notification.id);
        }
        window.location.assign(link);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full text-left flex items-start gap-3 cursor-pointer px-3 py-3 border-b border-gray-100 transition-colors hover:bg-gray-100 ${
                unread ? "bg-primary/5" : ""
            }`}
        >
            <div className="shrink-0">
                {thumb ? (
                    <img
                        className="w-[70px] h-[70px] rounded-md object-cover bg-gray-100"
                        src={thumb}
                        alt=""
                    />
                ) : (
                    <div className="w-[70px] h-[70px] rounded-md bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                        {badge}
                    </div>
                )}
            </div>
            <div className="w-full min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
                    {headline}
                </p>
                <p className="font-semibold text-gray-900 leading-snug">{primary}</p>
                {secondary && (
                    <p className="text-sm text-gray-700 mt-0.5 line-clamp-3">
                        {secondary}
                    </p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                    {format(notification.created_at)}
                </p>
            </div>
        </button>
    );
};

export default NotificationRow;
