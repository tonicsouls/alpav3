
import React from 'react';
import { mockDocuments } from '../services/mockDataService';
import { DocumentIcon } from './icons/DocumentIcon';

interface MockDocumentSelectorProps {
    onSelect: (name: string, content: string) => void;
    disabled: boolean;
}

export const MockDocumentSelector: React.FC<MockDocumentSelectorProps> = ({ onSelect, disabled }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select a Sample Document</label>
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {mockDocuments.map((doc) => (
                    <button
                        key={doc.name}
                        onClick={() => onSelect(doc.name, doc.content)}
                        disabled={disabled}
                        className="flex items-center gap-2 p-2 text-left bg-gray-50 border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Select document ${doc.name}`}
                    >
                        <DocumentIcon className="text-red-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 truncate">{doc.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
