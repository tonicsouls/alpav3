import React, { useState, useCallback } from 'react';
import { FileUpload } from '../components/FileUpload';
import { WorkflowTracker } from '../components/WorkflowTracker';
import { analyzeFileContent } from '../services/geminiService';
import { findCustomerByDetails, renameAndMoveFile } from '../services/crmService';
import { WorkflowStep, WorkflowStepName, WorkflowStepStatus, ExtractedFileInfo, WorkflowConfig } from '../types';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { ModelSelector } from '../components/ModelSelector';
import { ActionLog } from '../components/ActionLog';
import { TerminalIcon } from '../components/icons/TerminalIcon';
import { MockDocumentSelector } from '../components/MockDocumentSelector';

const initialSteps: WorkflowStep[] = [
    { name: WorkflowStepName.ANALYZE_FILE, status: WorkflowStepStatus.PENDING, details: 'Waiting to start...' },
    { name: WorkflowStepName.FIND_CUSTOMER, status: WorkflowStepStatus.PENDING, details: 'Awaiting file analysis.' },
    { name: WorkflowStepName.RENAME_FILE, status: WorkflowStepStatus.PENDING, details: 'Awaiting CRM validation.' },
    { name: WorkflowStepName.MOVE_FILE, status: WorkflowStepStatus.PENDING, details: 'Awaiting file rename.' },
];

interface FinalResult {
    newFileName: string;
    destination: string;
    renameCommand: string;
    moveCommand: string;
}

interface DashboardPageProps {
    logs: string[];
    logAction: (message: string) => void;
    modelName: string;
    workflowConfig: WorkflowConfig;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ logs, logAction, modelName, workflowConfig }) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialSteps);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
    const [processingMode, setProcessingMode] = useState<'cloud' | 'local'>('cloud');
    const [localModelOutput, setLocalModelOutput] = useState<string>('');


    const resetWorkflow = useCallback(() => {
        setWorkflowSteps([...initialSteps]);
        setError(null);
        setFinalResult(null);
        setLocalModelOutput('');
        // Do not clear action log on reset, so user can see history
    }, []);
    
    const handleFileSelect = (selectedFile: File, content: string) => {
        setFile(selectedFile);
        setFileContent(content);
        setSelectedFileName(selectedFile.name)
        resetWorkflow();
        logAction(`File selected: ${selectedFile.name}`);
    };

    const handleMockDocSelect = (name: string, content: string) => {
        const mockFile = new File([content], name, { type: "text/plain" });
        handleFileSelect(mockFile, content);
    };

    const updateStepStatus = useCallback((stepName: WorkflowStepName, status: WorkflowStepStatus, details: string) => {
        setWorkflowSteps(prevSteps =>
            prevSteps.map(step =>
                step.name === stepName ? { ...step, status, details } : step
            )
        );
    }, []);

    const executeWorkflowSteps = async (analysisResult: ExtractedFileInfo, currentFile: File) => {
        // Step 2: Find Customer in CRM
        updateStepStatus(WorkflowStepName.FIND_CUSTOMER, WorkflowStepStatus.RUNNING, `Searching CRM for "${analysisResult.customerIdentifier}"...`);
        logAction(`Searching CRM for customer matching "${analysisResult.customerIdentifier}".`);
        const customer = await findCustomerByDetails(analysisResult.customerIdentifier);
        if (!customer) {
            throw new Error(`Customer with identifier "${analysisResult.customerIdentifier}" not found in CRM.`);
        }
        updateStepStatus(WorkflowStepName.FIND_CUSTOMER, WorkflowStepStatus.SUCCESS, `Found Customer: ${customer.name} (ID: ${customer.shortId})`);
        logAction(`Customer found: ${customer.name} (ID: ${customer.shortId}).`);

        // Step 3: Rename File
        updateStepStatus(WorkflowStepName.RENAME_FILE, WorkflowStepStatus.RUNNING, "Generating new file name...");
        logAction("Generating new file name based on customer and file type.");
        const { newFileName } = await renameAndMoveFile(currentFile.name, customer.shortId, analysisResult.fileType, workflowConfig);
        updateStepStatus(WorkflowStepName.RENAME_FILE, WorkflowStepStatus.SUCCESS, `New name: ${newFileName}`);
        logAction(`New file name generated: ${newFileName}.`);


        // Step 4: Move File
        updateStepStatus(WorkflowStepName.MOVE_FILE, WorkflowStepStatus.RUNNING, "Simulating move to secure folder...");
        logAction(`Calculating destination folder for file type "${analysisResult.fileType}".`);
        const { destination } = await renameAndMoveFile(currentFile.name, customer.shortId, analysisResult.fileType, workflowConfig);
        updateStepStatus(WorkflowStepName.MOVE_FILE, WorkflowStepStatus.SUCCESS, `Destination: ${destination}`);
        logAction(`Simulated move to: ${destination}.`);

        const renameCommand = `mv "${currentFile.name}" "${newFileName}"`;
        const moveCommand = `mv "${newFileName}" "${destination}"`;

        setFinalResult({ newFileName, destination, renameCommand, moveCommand });
        logAction("Workflow finished successfully.");
    };

    const handleStartWorkflow = async () => {
        if (!file || !fileContent) {
            setError("Please select a file first.");
            return;
        }

        setIsProcessing(true);
        resetWorkflow();
        logAction(`Workflow started in "${processingMode}" mode using ${modelName}.`);

        if (processingMode === 'cloud') {
            try {
                // Step 1: Analyze File (Cloud)
                updateStepStatus(WorkflowStepName.ANALYZE_FILE, WorkflowStepStatus.RUNNING, `Sending to ${modelName} for analysis...`);
                logAction(`Sending document to Cloud AI (${modelName}) for analysis.`);
                const analysisResult = await analyzeFileContent(fileContent, modelName);
                if (!analysisResult.customerIdentifier || analysisResult.customerIdentifier === 'N/A') {
                    throw new Error("AI could not identify a valid customer in the document.");
                }
                updateStepStatus(WorkflowStepName.ANALYZE_FILE, WorkflowStepStatus.SUCCESS, `Type: ${analysisResult.fileType}, ID: ${analysisResult.customerIdentifier}`);
                logAction(`Cloud AI analysis received. Type: ${analysisResult.fileType}, ID: ${analysisResult.customerIdentifier}`);

                await executeWorkflowSteps(analysisResult, file);

            } catch (err: any) {
                const errorMessage = err.message || "An unknown error occurred.";
                setError(errorMessage);
                logAction(`ERROR: ${errorMessage}`);
                const currentStepIndex = workflowSteps.findIndex(s => s.status === WorkflowStepStatus.RUNNING);
                const stepToFail = workflowSteps[currentStepIndex > -1 ? currentStepIndex : 0];
                updateStepStatus(stepToFail.name, WorkflowStepStatus.ERROR, errorMessage);
            } finally {
                setIsProcessing(false);
            }
        } else { // Local mode
            updateStepStatus(WorkflowStepName.ANALYZE_FILE, WorkflowStepStatus.PENDING, "Awaiting analysis from local model.");
            logAction("Ready for local model processing. Please follow the instructions.");
            setIsProcessing(false); 
        }
    };

    const handleLocalAnalysisSubmit = async () => {
        if (!file) return;

        let analysisResult: ExtractedFileInfo;
        logAction("Attempting to parse local model output.");
        try {
            analysisResult = JSON.parse(localModelOutput);
            if (typeof analysisResult.fileType !== 'string' || typeof analysisResult.customerIdentifier !== 'string') {
                throw new Error("Invalid JSON structure. Missing 'fileType' or 'customerIdentifier' properties.");
            }
            logAction(`Local model output parsed successfully. Type: ${analysisResult.fileType}, ID: ${analysisResult.customerIdentifier}`);
        } catch (e: any) {
            const errorMessage = `Invalid JSON from local model: ${e.message}`;
            setError(errorMessage);
            logAction(`ERROR: ${errorMessage}`);
            updateStepStatus(WorkflowStepName.ANALYZE_FILE, WorkflowStepStatus.ERROR, `Invalid JSON provided.`);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            updateStepStatus(WorkflowStepName.ANALYZE_FILE, WorkflowStepStatus.SUCCESS, `Type: ${analysisResult.fileType}, ID: ${analysisResult.customerIdentifier}`);
            await executeWorkflowSteps(analysisResult, file);
        } catch (err: any) {
            const errorMessage = err.message || "An unknown error occurred.";
            setError(errorMessage);
            logAction(`ERROR: ${errorMessage}`);
            const currentStepIndex = workflowSteps.findIndex(s => s.status === WorkflowStepStatus.RUNNING);
            const stepToFail = workflowSteps[currentStepIndex > -1 ? currentStepIndex : 0];
            updateStepStatus(stepToFail.name, WorkflowStepStatus.ERROR, errorMessage);
        } finally {
            setIsProcessing(false);
        }
    }

    const isLocalModeReadyForInput = processingMode === 'local' && file && workflowSteps[0].status === WorkflowStepStatus.PENDING && !finalResult;
    
    return (
        <>
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    <span className="text-red-600">Secure</span> Document Processor
                </h1>
                <p className="mt-2 text-lg text-gray-600">Automated file analysis, validation, and organization powered by AI.</p>
            </header>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Side: Upload & Control */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-red-500 pb-2">1. Configure & Upload</h2>
                        <ModelSelector mode={processingMode} setMode={setProcessingMode} disabled={isProcessing} />
                        
                        <MockDocumentSelector onSelect={handleMockDocSelect} disabled={isProcessing} />

                        <div className="flex items-center text-center">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 uppercase text-gray-500 font-semibold text-sm">Or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} fileName={selectedFileName} />
                        
                        {!isLocalModeReadyForInput && (
                            <button
                                onClick={handleStartWorkflow}
                                disabled={!file || isProcessing}
                                className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-red-500/50"
                            >
                                {isProcessing ? <><SpinnerIcon /> Processing...</> : "Start Secure Workflow"}
                            </button>
                        )}

                            {isLocalModeReadyForInput && (
                            <div className="space-y-4 p-4 border border-red-300 rounded-lg bg-red-50">
                                <h3 className="font-semibold text-red-800">Local Processing Required</h3>
                                <p className="text-sm text-red-700">Run your local model (e.g., Gemma) with the file content and paste the JSON output below.</p>
                                <div className="bg-gray-800 p-3 rounded-md text-xs text-gray-200 font-mono">
                                    <p className="text-white"><span className="text-green-400">$</span> gemini analyze-doc --file "{file?.name}"</p>
                                </div>
                                <textarea
                                    value={localModelOutput}
                                    onChange={(e) => setLocalModelOutput(e.target.value)}
                                    placeholder='Paste JSON output here... e.g., {"fileType": "Invoice", "customerIdentifier": "INV-12345"}'
                                    className="w-full h-24 p-2 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                                    aria-label="Local model output"
                                />
                                <button
                                    onClick={handleLocalAnalysisSubmit}
                                    disabled={!localModelOutput || isProcessing}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Continue Workflow
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Workflow Status */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-red-500 pb-2">2. Workflow Status</h2>
                        <WorkflowTracker steps={workflowSteps} />
                    </div>
                </div>

                {/* Results & Errors */}
                {(error || finalResult) && (
                        <div className="pt-6 border-t border-gray-200">
                            {error && (
                            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg">
                                <h3 className="font-bold">Workflow Failed</h3>
                                <p>{error}</p>
                            </div>
                        )}
                        {finalResult && (
                            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg space-y-4">
                                <h3 className="font-bold text-lg text-green-900">Workflow Complete!</h3>
                                <div>
                                    <p className="font-semibold text-gray-800">File Renamed To:</p>
                                    <p className="font-mono bg-gray-100 p-2 rounded text-sm text-gray-700">{finalResult.newFileName}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">Actionable Commands (for POSIX systems like Linux/macOS):</p>
                                    <div className="font-mono bg-gray-800 text-gray-200 p-3 rounded text-sm space-y-2">
                                        <p><span className="text-gray-400"># 1. Rename the file</span><br/><span className="text-green-400">$</span> {finalResult.renameCommand}</p>
                                        <p><span className="text-gray-400"># 2. Move to secure folder</span><br/><span className="text-green-400">$</span> {finalResult.moveCommand}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                )}
                
                    {/* Action Log */}
                {logs.length > 1 && (
                    <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <TerminalIcon />
                            <h3 className="text-xl font-bold text-gray-800">Execution Log</h3>
                        </div>
                        <ActionLog logs={logs} />
                    </div>
                )}
            </div>
        </>
    );
};