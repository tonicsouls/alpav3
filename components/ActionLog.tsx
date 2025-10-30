
import React from 'react';

interface ActionLogProps {
    logs: string[];
}

export const ActionLog: React.FC<ActionLogProps> = ({ logs }) => {
    const logContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div 
            ref={logContainerRef}
            className="w-full h-48 p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm text-gray-200 overflow-y-auto"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="additions"
        >
            {logs.map((log, index) => (
                <p key={index} className="whitespace-pre-wrap"><span className="text-gray-500 mr-2">{log.substring(0, 10)}</span>{log.substring(10)}</p>
            ))}
        </div>
    );
};
