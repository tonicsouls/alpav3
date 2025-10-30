
export enum WorkflowStepStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    SUCCESS = 'success',
    ERROR = 'error',
}

export enum WorkflowStepName {
    ANALYZE_FILE = 'Analyze Document Content',
    FIND_CUSTOMER = 'Validate Customer in CRM',
    RENAME_FILE = 'Rename File',
    MOVE_FILE = 'Move to Secure Folder',
}

export interface WorkflowStep {
    name: WorkflowStepName;
    status: WorkflowStepStatus;
    details: string;
}

export interface ExtractedFileInfo {
    fileType: string;
    customerIdentifier: string;
}

export interface CustomerData {
    id: string;
    name: string;
    address: string;
    email: string;
    shortId: string;
}

export type NamingConvention = 'ID_TYPE_NAME' | 'TYPE_ID_NAME';

export interface WorkflowConfig {
    secureBasePath: string;
    namingConvention: NamingConvention;
}