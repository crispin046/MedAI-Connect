import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Referral } from '../types';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { ReferralCard } from './ReferralCard';


export const ReferralsPage: React.FC = () => {
    const [referrals, setReferrals] = useState<Referral[]>(() => {
        try {
            const saved = sessionStorage.getItem('medai-referrals');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse referrals from session storage", error);
            return [];
        }
    });
    const [isDoctorOnline, setIsDoctorOnline] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const { newReferral } = (location.state || {}) as { newReferral?: Referral };
        if (newReferral && !referrals.some(r => r.id === newReferral.id)) {
            setReferrals(prev => [newReferral, ...prev]);
        }
    }, [location.state, referrals]);

    useEffect(() => {
        sessionStorage.setItem('medai-referrals', JSON.stringify(referrals));
    }, [referrals]);

    // Simulate real-time doctor status updates (e.g., from FCM)
    useEffect(() => {
        const interval = setInterval(() => {
            setIsDoctorOnline(prevStatus => !prevStatus);
        }, 7000); // Toggles every 7 seconds for demonstration

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);


    const handleUpdateReferral = (updatedReferral: Referral) => {
        setReferrals(prev => prev.map(r => r.id === updatedReferral.id ? updatedReferral : r));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Doctor Review & Referrals</h1>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0 bg-gray-100 px-3 py-2 rounded-lg border">
                    <span className="relative flex h-3 w-3">
                         {isDoctorOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isDoctorOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className={`text-sm font-medium ${isDoctorOnline ? 'text-green-700' : 'text-red-700'}`}>
                        Doctor Status: {isDoctorOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            {referrals.length === 0 ? (
                 <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
                    <MessageSquareIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <h2 className="mt-4 text-xl font-medium text-gray-900">No Referrals Yet</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        After performing a triage analysis, you can send cases here for a doctor's review.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {referrals.map(referral => (
                        <ReferralCard
                            key={referral.id}
                            referral={referral}
                            isDoctorOnline={isDoctorOnline}
                            onUpdate={handleUpdateReferral}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};