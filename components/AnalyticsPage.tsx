import React, { useMemo } from 'react';
import type { Referral } from '../types';
import { BarChart } from './charts/BarChart';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center">
            <div className="bg-teal-100 text-teal-600 p-3 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

export const AnalyticsPage: React.FC = () => {
    const referrals = useMemo(() => {
        try {
            const saved = sessionStorage.getItem('medai-referrals');
            return saved ? JSON.parse(saved) as Referral[] : [];
        } catch (error) {
            console.error("Failed to parse referrals from session storage", error);
            return [];
        }
    }, []);

    const analyticsData = useMemo(() => {
        if (referrals.length === 0) return null;

        const urgencyCounts: { [key: string]: number } = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
        const conditionCounts: { [key: string]: number } = {};

        referrals.forEach(r => {
            const urgency = r.triageResult.urgencyLevel;
            if (urgency in urgencyCounts) {
                urgencyCounts[urgency]++;
            }

            r.triageResult.possibleConditions.forEach(condition => {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            });
        });

        const sortedConditions = Object.entries(conditionCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 7);
        
        const mostFrequentCondition = sortedConditions.length > 0 ? sortedConditions[0][0] : 'N/A';
        const totalCritical = urgencyCounts['Critical'] + urgencyCounts['High'];

        return {
            totalAssessments: referrals.length,
            totalCritical,
            mostFrequentCondition,
            urgencyData: {
                labels: Object.keys(urgencyCounts),
                values: Object.values(urgencyCounts),
            },
            conditionData: {
                labels: sortedConditions.map(([label]) => label),
                values: sortedConditions.map(([, value]) => value),
            },
        };
    }, [referrals]);

    if (!analyticsData) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
                 <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
                    <TrendingUpIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <h2 className="mt-4 text-xl font-medium text-gray-900">No Analytics Data Yet</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Perform triage assessments and send them for review to see health data visualizations here.
                    </p>
                </div>
            </div>
        );
    }
    
    const urgencyColors = ['#22c55e', '#facc15', '#fb923c', '#ef4444'];
    const conditionColors = ['#14b8a6', '#22d3ee', '#60a5fa', '#a78bfa', '#f472b6', '#fb923c', '#facc15'];

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Health Analytics Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Assessments" value={analyticsData.totalAssessments} icon={<ClipboardIcon className="w-6 h-6"/>} />
                <StatCard title="High/Critical Cases" value={analyticsData.totalCritical} icon={<AlertTriangleIcon className="w-6 h-6"/>} />
                <StatCard title="Most Frequent Condition" value={analyticsData.mostFrequentCondition} icon={<CheckCircleIcon className="w-6 h-6"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Triage Urgency Levels</h2>
                    <BarChart 
                        data={analyticsData.urgencyData} 
                        colors={urgencyColors}
                    />
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Common Conditions</h2>
                     <BarChart 
                        data={analyticsData.conditionData}
                        colors={conditionColors}
                     />
                </div>
            </div>
        </div>
    );
};