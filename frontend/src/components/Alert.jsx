export default function Alert({ type = 'error', messages = [] }) {
    if (!messages || messages.length === 0) return null;

    const styles = {
        error: 'bg-red-100 border-red-400 text-red-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    };
    return (
        <div className={`p-4 border rounded-lg mb-4 ${styles[type]}`}>
            {messages.length === 1 ? (
                <p>{messages[0]}</p>
            ) : (
                <ul className="list-disc list-inside">
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}