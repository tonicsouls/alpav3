import React, { useState } from 'react';
import { DocumentIcon } from '../components/icons/DocumentIcon';
import { FolderMoveIcon } from '../components/icons/FolderMoveIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { UserSearchIcon } from '../components/icons/UserSearchIcon';
import { WorkflowConfig, NamingConvention } from '../types';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const workflowSteps = [
    { name: 'Analyze Document', icon: <DocumentIcon className="h-5 w-5 text-white" />, description: 'AI model reads the document to identify its type and find a customer identifier (e.g., name, email, account number).' },
    { name: 'Validate Customer', icon: <UserSearchIcon className="h-5 w-5 text-white" />, description: 'The extracted identifier is checked against the CRM database to find a matching customer record.' },
    { name: 'Rename File', icon: <PencilIcon className="h-5 w-5 text-white" />, description: 'A standardized file name is generated using the customer\'s short ID and the document type.' },
    { name: 'Move to Secure Folder', icon: <FolderMoveIcon className="h-5 w-5 text-white" />, description: 'The renamed file is moved to a secure, organized folder structure based on the customer and document type.' },
];

interface WorkflowsPageProps {
    config: WorkflowConfig;
    // FIX: Corrected typo from WorkflowCode to WorkflowConfig
    setConfig: (config: WorkflowConfig) => void;
}

export const WorkflowsPage: React.FC<WorkflowsPageProps> = ({ config, setConfig }) => {
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

    // FIX: Made function generic for type safety
    const handleConfigChange = <K extends keyof WorkflowConfig>(key: K, value: WorkflowConfig[K]) => {
        setConfig({ ...config, [key]: value });
        setShowSaveConfirmation(true);
        setTimeout(() => setShowSaveConfirmation(false), 2000);
    }

    const NamingConventionRadio: React.FC<{ value: NamingConvention; label: string; example: string; }> = ({ value, label, example }) => (
        <label className={`flex flex-col p-3 border rounded-lg cursor-pointer transition-colors ${config.namingConvention === value ? 'bg-red-50 border-red-500 ring-2 ring-red-500' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
            <div className="flex items-center">
                <input
                    type="radio"
                    name="naming-convention"
                    value={value}
                    checked={config.namingConvention === value}
                    // FIX: Cast value to NamingConvention for type safety
                    onChange={(e) => handleConfigChange('namingConvention', e.target.value as NamingConvention)}
                    className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-3 font-medium text-gray-800">{label}</span>
            </div>
            <span className="ml-7 text-sm text-gray-500 font-mono">{example}</span>
        </label>
    );

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    Workflows
                </h1>
                <p className="mt-2 text-lg text-gray-600">Configure the default document processing workflow.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Workflow Steps */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Workflow Steps</h2>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                {workflowSteps.map((step, stepIdx) => (
                                <li key={step.name}>
                                    <div className="relative pb-8">
                                        {stepIdx !== workflowSteps.length - 1 ? (
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex items-start space-x-4">
                                            <div>
                                                <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                                                {step.icon}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5">
                                                <p className="text-md font-medium text-gray-900">{step.name}</p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side: Configuration */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Configuration</h2>
                     <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
                        {/* Secure Folder Path Config */}
                        <div>
                             <label htmlFor="secure-path" className="block text-lg font-medium text-gray-800">
                                Secure Folder Base Path
                            </label>
                            <p className="text-sm text-gray-500 mt-1 mb-3">Define the root directory where processed files will be moved. The system will create subdirectories within this path.</p>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <FolderMoveIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="secure-path"
                                    value={config.secureBasePath}
                                    onChange={(e) => handleConfigChange('secureBasePath', e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md shadow-sm"
                                    placeholder="//server/share/docs/"
                                />
                            </div>
                        </div>

                        {/* Naming Convention Config */}
                        <div>
                            <label className="block text-lg font-medium text-gray-800">
                                File Naming Convention
                            </label>
                            <p className="text-sm text-gray-500 mt-1 mb-3">Choose the pattern for renaming files after successful processing.</p>
                            <fieldset className="space-y-4">
                                <legend className="sr-only">File Naming Convention</legend>
                                <NamingConventionRadio value="ID_TYPE_NAME" label="ID First" example="JD12345_Invoice_original.txt" />
                                <NamingConventionRadio value="TYPE_ID_NAME" label="Type First" example="Invoice_JD12345_original.txt" />
                            </fieldset>
                        </div>
                         <div className={`flex items-center gap-2 text-green-600 transition-opacity duration-300 ${showSaveConfirmation ? 'opacity-100' : 'opacity-0'}`}>
                            <CheckCircleIcon className="h-5 w-5" />
                            <p className="text-sm font-medium">Changes saved automatically!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};