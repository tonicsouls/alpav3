
import React, { useCallback } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File, content: string) => void;
    disabled: boolean;
    fileName: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled, fileName }) => {
    const [error, setError] = React.useState<string | null>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('text/')) {
                setError("Please upload a text-based file (e.g., .txt, .md, .csv).");
                return;
            }

            setError(null);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileSelect(file, content);
            };
            reader.onerror = () => {
                setError("Failed to read the file.");
            };
            reader.readAsText(file);
        }
    }, [onFileSelect]);

    return (
        <div className="w-full">
            <label
                htmlFor="file-upload"
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                    ${disabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed' : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-red-500'}`}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    {fileName ? (
                         <p className="font-semibold text-green-600 truncate">{fileName}</p>
                    ) : (
                        <>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-400">TXT, MD, CSV, or other text files</p>
                        </>
                    )}
                </div>
                <input
                    id="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={disabled}
                    accept=".txt,.md,.csv,text/*"
                />
            </label>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
};
