document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const get = (key, fallback = "Not provided") => params.get(key)?.trim() || fallback;

    const firstName = get("firstName", "");
    const lastName = get("lastName", "");
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Not provided";

    const levelMap = {
        "NP": "Non-Profit (Free)",
        "Bronze": "Bronze (₦15,000/yr)",
        "Silver": "Silver (₦35,000/yr)",
        "Gold": "Gold (₦65,000/yr)",
    };
    const rawLevel = get("membershipLevel", "");
    const membershipLabel = levelMap[rawLevel] || rawLevel || "Not provided";

    let formattedTimestamp = "Not provided";
    const rawTimestamp = params.get("timestamp");
    if (rawTimestamp) {
        try {
            const d = new Date(rawTimestamp);
            formattedTimestamp = d.toLocaleString("en-NG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            formattedTimestamp = rawTimestamp;
        }
    }

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("display-name", fullName);
    set("display-orgTitle", get("orgTitle"));
    set("display-email", get("email"));
    set("display-mobile", get("mobile"));
    set("display-businessName", get("businessName"));
    set("display-membershipLevel", membershipLabel);
    set("display-timestamp", formattedTimestamp);
});
