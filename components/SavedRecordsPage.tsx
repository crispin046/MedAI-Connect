import React, { useState, useEffect } from 'react';
import type { SavedRecord } from '../types';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { SavedRecordCard } from './SavedRecordCard';

export const SavedRecordsPage: React.FC = () => {
    const [records, setRecords] = useState<SavedRecord[]>([]);

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem('medai-saved-records');
            const parsedRecords = saved ? JSON.parse(saved) : [];
            setRecords(parsedRecords);
        } catch (error) {
            console.error("Failed to parse saved records from session storage", error);
            setRecords([]);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('medai-saved-records', JSON.stringify(records));
    }, [records]);

    const handleDeleteRecord = (id: string) => {
        if (window.confirm('Are you sure you want to delete this saved record?')) {
            setRecords(prev => prev.filter(r => r.id !== id));
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Saved Triage Records</h1>
                <p className="text-gray-600 mt-1">
                    These records are saved on your device for this session. You can view details or delete them.
                </p>
            </div>

            {records.length === 0 ? (
                 <div className="text-center py-16 px-6 bg-white rounded-lg border border-dashed">
                    <ArchiveIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <h2 className="mt-4 text-xl font-medium text-gray-900">No Saved Records</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        After performing a triage analysis, you can save cases here to review them later.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {records.map(record => (
                        <SavedRecordCard
                            key={record.id}
                            record={record}
                            onDelete={handleDeleteRecord}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};