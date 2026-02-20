export default function Alert({ type = 'error', messages = [] }) {
    if (!messages || messages.length === 0) return null;

    const styles = {
        error: {
            wrapper: 'bg-[#8B1A1A]/15 border-[#8B1A1A]/40 text-[#e07070]',
            icon: '✕',
        },
        success: {
            wrapper: 'bg-[#2A4A1A]/20 border-[#4A7A2A]/40 text-[#90c870]',
            icon: '✓',
        },
        info: {
            wrapper: 'bg-[#1A2A4A]/20 border-[#2A4A8A]/40 text-[#7090d0]',
            icon: 'ℹ',
        },
        warning: {
            wrapper: 'bg-[#4A3A0A]/20 border-[#C8972B]/35 text-[#C8972B]',
            icon: '⚠',
        },
    };

    const { wrapper, icon } = styles[type] || styles.error;

    return (
        <div className={`p-4 border rounded-sm mb-4 ${wrapper}`}
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>
            <div className="flex items-start gap-2">
                <span className="text-xs mt-0.5 opacity-70 shrink-0">{icon}</span>
                <div className="flex-1">
                    {messages.length === 1 ? (
                        <p className="text-sm">{messages[0]}</p>
                    ) : (
                        <ul className="list-none space-y-1">
                            {messages.map((message, index) => (
                                <li key={index} className="text-sm flex items-start gap-1.5">
                                    <span className="opacity-40 text-xs mt-0.5">❈</span>
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