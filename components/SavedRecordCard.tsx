import React, { useState } from 'react';
import type { SavedRecord } from '../types';
import { Trash2Icon } from './icons/Trash2Icon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ChevronUpIcon } from './icons/ChevronUpIcon';

interface SavedRecordCardProps {
    record: SavedRecord;
    onDelete: (id: string) => void;
}

const getUrgencyClass = (level: SavedRecord['triageResult']['urgencyLevel']) => {
  switch (level) {
    case 'Critical': return 'bg-red-100 text-red-800';
    case 'High': return 'bg-orange-100 text-orange-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityClass = (level: SavedRecord['triageResult']['referralPriority']) => {
  switch (level) {
    case 'Urgent': return 'bg-red-100 text-red-800';
    case 'Semi-Urgent': return 'bg-orange-100 text-orange-800';
    case 'Routine': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};


export const SavedRecordCard: React.FC<SavedRecordCardProps> = ({ record, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formattedDate = new Date(record.timestamp).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start">
               <div>
                    <p className="text-sm text-gray-500">Saved: {formattedDate}</p>
                    <p className="text-lg font-semibold text-gray-800">{record.patientData.symptoms.substring(0, 50)}...</p>
                    <p className="text-sm text-gray-600">Patient Age: {record.patientData.age}</p>
               </div>
               <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getUrgencyClass(record.triageResult.urgencyLevel)}`}>
                        {record.triageResult.urgencyLevel} Urgency
                    </span>
                     <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityClass(record.triageResult.referralPriority)}`}>
                        {record.triageResult.referralPriority} Priority
                    </span>
               </div>
            </div>
           
            {isExpanded && (
                <div className="mt-4 border-t pt-4 space-y-4 animate-fade-in">
                     <div>
                        <h3 className="font-semibold text-gray-600 mb-2">Possible Conditions</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                        {record.triageResult.possibleConditions.map((condition, index) => (
                            <li key={index} className="ml-2">{condition}</li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600 mb-2">Triage Explanation</h3>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border">{record.triageResult.triageExplanation}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600 mb-2">Recommended Next Steps</h3>
                        <ul className="list-decimal list-inside space-y-2 text-gray-800 text-sm">
                        {record.triageResult.recommendedNextSteps.map((step, index) => (
                            <li key={index} className="ml-2">{step}</li>
                        ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="mt-4 border-t pt-3 flex justify-between items-center">
                <button 
                    onClick={() => setIsExpanded(prev => !prev)}
                    className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-800"
                >
                    {isExpanded ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                </button>
                 <button 
                    onClick={() => onDelete(record.id)}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
                 >
                    <Trash2Icon className="w-4 h-4"/>
                    Delete
                </button>
            </div>
        </div>
    );
};