const OsCommand = () => {
    if (typeof window !== "undefined") {
        const platform = navigator.platform.toLowerCase();
        if (platform.includes("mac")) {
            return "\u2318";
        }
    }
    return "Ctrl";
};

export default OsCommand;
