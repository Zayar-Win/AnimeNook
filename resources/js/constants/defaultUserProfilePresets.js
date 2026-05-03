/**
 * Default avatar image URLs for group admin "Add / edit user" presets.
 * Hardcoded in the app (not loaded from the database). Swap `src` values for
 * your own CDN paths or signed URLs when ready.
 *
 * @type {ReadonlyArray<{ id: string, label: string, src: string }>}
 */
export const DEFAULT_USER_PROFILE_PRESETS = Object.freeze([
    {
        id: "preset-1",
        label: "Ocean",
        src: "/1.jpeg",
    },
    {
        id: "preset-2",
        label: "Forest",
        src: "/2.jpeg",
    },
    {
        id: "preset-3",
        label: "Sunset",
        src: "/3.jpeg",
    },
    {
        id: "preset-4",
        label: "Mountain",
        src: "/4.jpeg",
    },
    {
        id: "preset-5",
        label: "Aurora",
        src: "/5.jpeg",
    },
    {
        id: "preset-6",
        label: "City",
        src: "/6.jpeg",
    },
]);
