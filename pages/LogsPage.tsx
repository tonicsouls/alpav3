import React from 'react';
import { ActionLog } from '../components/ActionLog';
import { TerminalIcon } from '../components/icons/TerminalIcon';

interface LogsPageProps {
    logs: string[];
}


export const LogsPage: React.FC<LogsPageProps> = ({ logs }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                    Audit Logs
                </h1>
                <p className="mt-2 text-lg text-gray-600">Review all system and user activities for the current session.</p>
            </header>
            <main className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                 <div className="flex items-center gap-3 mb-4">
                    <TerminalIcon />
                    <h2 className="text-xl font-bold text-gray-800">System Execution Log</h2>
                </div>
                {logs.length > 1 ? (
                    <ActionLog logs={logs} />
                ) : (
                    <div className="text-center text-gray-500 py-16">
                        <p className="text-xl font-semibold">No Activity Yet</p>
                        <p>Go to the Dashboard, upload a file, and run a workflow to see logs here.</p>
                    </div>
                )}
            </main>
        </div>
    );
};