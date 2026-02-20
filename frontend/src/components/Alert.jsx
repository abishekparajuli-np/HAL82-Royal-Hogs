export default function Alert({ type = "error", messages = [] }) {
    if (!messages || messages.length === 0) return null;

    const styles = {
        error: {
            wrapper: "bg-[#FDF0F1] border-[#C4445A]/35 text-[#7D1C2B]",
            iconBg: "bg-[#9B2335]/10",
            iconColor: "#9B2335",
            icon: "✕",
        },
        success: {
            wrapper: "bg-[#F0FAF3] border-[#2D7A4F]/30 text-[#1C5934]",
            iconBg: "bg-[#2D7A4F]/10",
            iconColor: "#2D7A4F",
            icon: "✓",
        },
        info: {
            wrapper: "bg-[#F0F5FC] border-[#3A6AAD]/25 text-[#1E3F6B]",
            iconBg: "bg-[#3A6AAD]/10",
            iconColor: "#3A6AAD",
            icon: "ℹ",
        },
        warning: {
            wrapper: "bg-[#FDF8ED] border-[#B8892A]/35 text-[#7A5A10]",
            iconBg: "bg-[#B8892A]/10",
            iconColor: "#B8892A",
            icon: "⚠",
        },
    };

    const { wrapper, iconBg, iconColor, icon } = styles[type] || styles.error;

    return (
        <div
            className={`p-4 border rounded-xl mb-4 ${wrapper}`}
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
        >
            <div className="flex items-start gap-3">
                {/* Icon pill */}
                <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: iconBg, color: iconColor }}
                >
                    {icon}
                </span>

                {/* Message(s) */}
                <div className="flex-1">
                    {messages.length === 1 ? (
                        <p className="text-sm leading-relaxed">{messages[0]}</p>
                    ) : (
                        <ul className="list-none space-y-1.5">
                            {messages.map((message, index) => (
                                <li key={index} className="text-sm flex items-start gap-2 leading-relaxed">
                                    <span
                                        className="text-xs mt-0.5 shrink-0"
                                        style={{ color: iconColor, opacity: 0.6 }}
                                    >
                                        ◆
                                    </span>
                                    {message}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}