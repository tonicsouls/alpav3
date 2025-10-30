import React from 'react';

interface SettingsPageProps {
    modelName: string;
    setModelName: (name: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ modelName, setModelName }) => {
    const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setModelName(event.target.value);
    };

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    Settings
                </h1>
                <p className="mt-2 text-lg text-gray-600">Configure application preferences and integrations.</p>
            </header>
            <main className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">AI Configuration</h2>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="model-select" className="block text-lg font-medium text-gray-800">
                                Cloud AI Model
                            </label>
                            <p className="text-sm text-gray-500 mt-1 mb-3">Select the Gemini model to use for document analysis. The Pro model is more powerful but may be slower or have different rate limits.</p>
                            <select
                                id="model-select"
                                value={modelName}
                                onChange={handleModelChange}
                                className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            </select>
                        </div>
                         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">Changes are saved automatically and will be applied to the next workflow run from the dashboard.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};