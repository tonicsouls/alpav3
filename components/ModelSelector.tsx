
import React from 'react';

interface ModelSelectorProps {
    mode: 'cloud' | 'local';
    setMode: (mode: 'cloud' | 'local') => void;
    disabled: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ mode, setMode, disabled }) => {
    const baseClasses = "w-full text-center px-4 py-2 rounded-md transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500";
    const activeClasses = "bg-red-600 text-white shadow";
    const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-200";

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Processing Mode</label>
            <div className={`grid grid-cols-2 gap-2 p-1 rounded-lg bg-gray-100 border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button
                    onClick={() => setMode('cloud')}
                    disabled={disabled}
                    className={`${baseClasses} ${mode === 'cloud' ? activeClasses : inactiveClasses}`}
                    aria-pressed={mode === 'cloud'}
                >
                    Cloud AI
                </button>
                <button
                    onClick={() => setMode('local')}
                    disabled={disabled}
                    className={`${baseClasses} ${mode === 'local' ? activeClasses : inactiveClasses}`}
                     aria-pressed={mode === 'local'}
                >
                    Local Model
                </button>
            </div>
        </div>
    );
};
