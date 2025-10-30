import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { LogsPage } from './pages/LogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { WorkflowConfig } from './types';

const App: React.FC = () => {
    // Simple hash-based routing
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#dashboard');
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [modelName, setModelName] = useState('gemini-2.5-flash');
    const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
        secureBasePath: '//secure-filestore/',
        namingConvention: 'ID_TYPE_NAME',
    });

    const logAction = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setActionLog(prev => [...prev, `[${timestamp}] ${message}`]);
    }, []);

    useEffect(() => {
        if (actionLog.length === 0) {
            logAction('Session started.');
        }
    }, [actionLog.length, logAction]);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrentPath(window.location.hash || '#dashboard');
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const renderPage = () => {
        switch (currentPath) {
            case '#workflows':
                return <WorkflowsPage config={workflowConfig} setConfig={setWorkflowConfig} />;
            case '#logs':
                return <LogsPage logs={actionLog} />;
            case '#settings':
                return <SettingsPage modelName={modelName} setModelName={setModelName} />;
            case '#dashboard':
            default:
                return <DashboardPage logs={actionLog} logAction={logAction} modelName={modelName} workflowConfig={workflowConfig} />;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar currentPath={currentPath} />
            <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
               {renderPage()}
            </main>
        </div>
    );
};

export default App;