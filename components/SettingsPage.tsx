
import React, { useState } from 'react';
import HonorHealthIcon from './icons/HonorHealthIcon';
import Loader from './Loader';

interface SettingsPageProps {
    isHonorHealthConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isHonorHealthConnected, onConnect, onDisconnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleConnect = () => {
        setIsConnecting(true);
        // Simulate API call for connection
        setTimeout(() => {
            onConnect();
            setIsConnecting(false);
        }, 1500);
    };

    const handleSync = () => {
        setIsSyncing(true);
        // Simulate API call for syncing
        setTimeout(() => {
            setIsSyncing(false);
        }, 2000);
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Settings & Integrations</h2>

                <div className="border-t border-secondary pt-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Connected Services</h3>
                    <p className="text-text-secondary text-sm mb-4">
                        Connect your favorite health and fitness apps to automatically sync your data with Gemini Fitness Pal.
                    </p>

                    <div className="bg-background p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <HonorHealthIcon className="w-10 h-10 text-primary" />
                            <div>
                                <p className="font-bold text-text-primary">Honor Health</p>
                                <p className={`text-xs font-semibold ${isHonorHealthConnected ? 'text-primary' : 'text-yellow-500'}`}>
                                    {isHonorHealthConnected ? 'Connected' : 'Not Connected'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            {isHonorHealthConnected ? (
                                <>
                                    <button 
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className="text-sm bg-secondary hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                                    </button>
                                    <button 
                                        onClick={onDisconnect} 
                                        className="text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                                    >
                                        Disconnect
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleConnect} 
                                    disabled={isConnecting}
                                    className="text-sm bg-primary hover:bg-primary-dark text-background font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect'}
                                </button>
                            )}
                        </div>
                    </div>
                    {isConnecting && <Loader message="Connecting to Honor Health..." />}
                    {isSyncing && <Loader message="Syncing your latest data..." />}

                </div>

            </div>
        </div>
    );
};

export default SettingsPage;
