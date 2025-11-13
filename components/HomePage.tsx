import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainIcon } from './icons/BrainIcon';
import { HospitalIcon } from './icons/HospitalIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AlertCircleIcon } from './icons/AlertCircleIcon';
import { WifiOffIcon } from './icons/WifiOffIcon';
import { ScaleIcon } from './icons/ScaleIcon';

const AgentCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string; buttonText: string }> = ({ to, icon, title, description, buttonText }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
    <div className="flex items-center space-x-4 mb-3">
      <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>
    <Link to={to} className="mt-auto block text-center bg-teal-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
      {buttonText}
    </Link>
  </div>
);

const StatCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-gray-100 p-4 rounded-lg flex items-center">
        <div className="mr-4 text-teal-500">{icon}</div>
        <div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    </div>
);


export const HomePage: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);


    return (
        <div className="bg-gray-50 min-h-full">
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Welcome Card */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Hello Health Worker 👋</h2>
                    <p className="text-gray-600 mt-2">Ready to begin today’s triage? Let’s help patients get care faster.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <Link to="/triage" className="flex-1 text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg">
                            Start New Assessment +
                        </Link>
                         <Link to="/saved-records" className="flex-1 text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-lg flex items-center justify-center gap-2">
                           <FileTextIcon className="w-5 h-5" /> View Saved Records
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Panel */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard label="Today's Assessments" value="12" icon={<FileTextIcon className="w-8 h-8"/>} />
                        <StatCard label="Referrals Sent" value="3" icon={<HospitalIcon className="w-8 h-8"/>} />
                        <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                            <div className="mr-4">
                                {isOnline ? <CheckCircleIcon className="w-8 h-8 text-green-500"/> : <AlertCircleIcon className="w-8 h-8 text-yellow-500"/>}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-800">{isOnline ? 'All Up-to-date' : 'Pending 3'}</div>
                                <div className="text-sm text-gray-600">Sync Status</div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Agent Menu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <AgentCard
                        to="/triage"
                        icon={<BrainIcon className="w-6 h-6" />}
                        title="Triage Agent"
                        description="Predicts likely conditions and urgency."
                        buttonText="Open Triage"
                    />
                    <AgentCard
                        to="/referrals"
                        icon={<HospitalIcon className="w-6 h-6" />}
                        title="Referral Agent"
                        description="Generates referral summaries and follow-ups."
                        buttonText="Open Referrals"
                    />
                    <AgentCard
                        to="/knowledge"
                        icon={<LightbulbIcon className="w-6 h-6" />}
                        title="Knowledge Agent"
                        description="Provides health guidance and educational support."
                        buttonText="Ask a Question"
                    />
                </div>
                
                 {/* AI Touch & Offline Notice */}
                {!isOnline && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-8 flex items-center gap-3">
                        <WifiOffIcon className="w-6 h-6" />
                        <div>
                            <p className="font-bold">You're currently offline</p>
                            <p className="text-sm">Don’t worry — assessments will sync automatically once connection is restored.</p>
                        </div>
                    </div>
                )}
                 <div className="text-center text-xs text-gray-500 mb-8">
                    <p>🤖 ADK Agent Active · Genkit online · Vertex linked</p>
                 </div>

            </main>
            {/* Footer */}
            <footer className="text-center pb-8 px-4">
                 <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 mx-auto" onClick={() => alert('MedAI Connect supports clinical decision-making and does not replace medical judgment.')}>
                    <ScaleIcon className="w-4 h-4" /> AI Ethics Notice
                 </button>
            </footer>
        </div>
    );
};