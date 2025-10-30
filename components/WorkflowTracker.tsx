import React from 'react';
import { WorkflowStep, WorkflowStepStatus } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { FolderMoveIcon } from './icons/FolderMoveIcon';
import { PencilIcon } from './icons/PencilIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UserSearchIcon } from './icons/UserSearchIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface WorkflowTrackerProps {
    steps: WorkflowStep[];
}

const getStepIcon = (stepName: string) => {
    const iconClassName = "h-5 w-5 text-gray-500";
    switch (stepName) {
        case 'Analyze Document Content':
            return <DocumentIcon className={iconClassName} />;
        case 'Validate Customer in CRM':
            return <UserSearchIcon className={iconClassName} />;
        case 'Rename File':
            return <PencilIcon className={iconClassName} />;
        case 'Move to Secure Folder':
            return <FolderMoveIcon className={iconClassName} />;
        default:
            return null;
    }
};


const getStatusIcon = (status: WorkflowStepStatus) => {
    switch (status) {
        case WorkflowStepStatus.PENDING:
            return <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>;
        case WorkflowStepStatus.RUNNING:
            return <SpinnerIcon className="text-red-500" />;
        case WorkflowStepStatus.SUCCESS:
            return <CheckCircleIcon className="text-green-500" />;
        case WorkflowStepStatus.ERROR:
            return <XCircleIcon className="text-red-500" />;
    }
};

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ steps }) => {
    const getStatusColorClasses = (status: WorkflowStepStatus) => {
        switch (status) {
            case WorkflowStepStatus.RUNNING:
                return 'text-red-600';
            case WorkflowStepStatus.SUCCESS:
                return 'text-green-600';
            case WorkflowStepStatus.ERROR:
                return 'text-red-600';
            default:
                return 'text-gray-500';
        }
    }

    return (
        <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
            {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getStepIcon(step.name)}
                        </div>
                        {index < steps.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-300 mt-1"></div>
                        )}
                    </div>
                    <div className="flex-grow pt-1">
                        <p className="font-semibold text-gray-800">{step.name}</p>
                        <div className={`flex items-center gap-2 text-sm ${getStatusColorClasses(step.status)}`}>
                           <div className="w-6 h-6 flex items-center justify-center">{getStatusIcon(step.status)}</div>
                           <p className="flex-1 break-words">{step.details}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};