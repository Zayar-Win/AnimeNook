import React, { useEffect, useRef } from "react";

/**
 * Manual AdSense display unit. Script is loaded globally in app.blade.php.
 * Remount (new key) when the page/chapter changes so a fresh ad is requested.
 */
const AdSenseUnit = ({
    client = "ca-pub-6217477979568177",
    slot,
    className = "",
    format = "auto",
    fullWidthResponsive = true,
}) => {
    const pushedRef = useRef(false);

    useEffect(() => {
        if (!slot || pushedRef.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushedRef.current = true;
        } catch (e) {
            // Ad blockers / missing script should not break the reader.
        }
    }, [slot]);

    if (!slot) return null;

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={
                    fullWidthResponsive ? "true" : "false"
                }
            />
        </div>
    );
};

export default AdSenseUnit;
