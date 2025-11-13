import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { TriageResult, PatientData, Referral, SavedRecord } from '../types';
import { Placeholder } from './Placeholder';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { LinkIcon } from './icons/LinkIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { languageMap } from '../useSpeechToText';
import { mockDoctors } from '../data/doctors';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface TriageResultPanelProps {
  result: TriageResult | null;
  isLoading: boolean;
  error: string | null;
  language: string;
  patientData: PatientData | null;
}

const getUrgencyClass = (level: TriageResult['urgencyLevel']) => {
  switch (level) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-400';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-400';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
    case 'Low': return 'bg-green-100 text-green-800 border-green-400';
    default: return 'bg-gray-100 text-gray-800 border-gray-400';
  }
};

const getPriorityClass = (level: TriageResult['referralPriority']) => {
  switch (level) {
    case 'Urgent': return 'bg-red-100 text-red-800 border-red-400';
    case 'Semi-Urgent': return 'bg-orange-100 text-orange-800 border-orange-400';
    case 'Routine': return 'bg-blue-100 text-blue-800 border-blue-400';
    default: return 'bg-gray-100 text-gray-800 border-gray-400';
  }
};

export const TriageResultPanel: React.FC<TriageResultPanelProps> = ({ result, isLoading, error, language, patientData }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasSpeechSupport = !!(typeof window !== 'undefined' && window.speechSynthesis);
  const navigate = useNavigate();

  const handleReadAloud = useCallback(() => {
    if (!result || !hasSpeechSupport) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `
      Triage Summary.
      Referral Priority: ${result.referralPriority}.
      Urgency Level: ${result.urgencyLevel}.
      Possible Conditions: ${result.possibleConditions.join(', ')}.
      Explanation: ${result.triageExplanation}.
      Recommended Next Steps: ${result.recommendedNextSteps.map((s, i) => `${i + 1}. ${s}`).join(' ')}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
    utterance.lang = languageMap[language] || 'en-US';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [result, isSpeaking, hasSpeechSupport, language]);
  
  const handleRequestReview = () => {
    if (!result || !patientData) return;
    
    const assignedDoctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];

    const referralData: Referral = {
      id: `ref_${new Date().getTime()}`,
      patientData: patientData,
      triageResult: result,
      status: 'Pending Review' as const,
      timestamp: new Date().toISOString(),
      assignedDoctor: assignedDoctor,
    };
    navigate('/referrals', { state: { newReferral: referralData } });
  };

  const handleSaveRecord = () => {
    if (!result || !patientData) return;

    const savedRecord: SavedRecord = {
      id: `rec_${new Date().getTime()}`,
      patientData: patientData,
      triageResult: result,
      timestamp: new Date().toISOString(),
    };
    
    const existingRecords = JSON.parse(sessionStorage.getItem('medai-saved-records') || '[]') as SavedRecord[];
    const updatedRecords = [savedRecord, ...existingRecords];
    sessionStorage.setItem('medai-saved-records', JSON.stringify(updatedRecords));
    
    navigate('/saved-records');
  };


  useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">AI Triage Summary</h2>
        {result && hasSpeechSupport && (
          <button 
            onClick={handleReadAloud}
            className={`p-2 rounded-full transition-colors ${
              isSpeaking 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            aria-label={isSpeaking ? 'Stop reading' : 'Read summary aloud'}
          >
            <SpeakerIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="h-[calc(100%-2.5rem)] overflow-y-auto pr-2 -mr-2">
        {isLoading && <LoadingSkeleton />}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-600">
            <AlertTriangleIcon className="w-12 h-12 mb-4" />
            <h3 className="font-semibold text-lg">Analysis Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {!isLoading && !error && !result && <Placeholder />}
        {result && (
          <>
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-4 mb-2">
                  <div>
                      <h3 className="font-semibold text-gray-600 mb-2 flex items-center text-sm">
                        <ShieldCheckIcon className="w-4 h-4 mr-1.5" />
                        Referral Priority
                      </h3>
                      <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getPriorityClass(result.referralPriority)}`}>
                        {result.referralPriority}
                      </span>
                  </div>
                  <div>
                      <h3 className="font-semibold text-gray-600 mb-2 flex items-center text-sm">
                          Urgency Level
                      </h3>
                      <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getUrgencyClass(result.urgencyLevel)}`}>
                          {result.urgencyLevel}
                      </span>
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">Possible Conditions</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-800">
                  {result.possibleConditions.map((condition, index) => (
                    <li key={index} className="ml-2">{condition}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">Triage Explanation</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{result.triageExplanation}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">Recommended Next Steps</h3>
                <ul className="list-decimal list-inside space-y-2 text-gray-800">
                  {result.recommendedNextSteps.map((step, index) => (
                    <li key={index} className="ml-2">{step}</li>
                  ))}
                </ul>
              </div>
              {result.sources && result.sources.length > 0 && (
                  <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Sources</h3>
                      <div className="space-y-2">
                          {result.sources.map((source, index) => (
                              <a 
                                  key={index} 
                                  href={source.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="flex items-center text-sm text-blue-600 hover:underline bg-blue-50 p-2 rounded-md transition-colors"
                              >
                                  <LinkIcon className="w-4 h-4 mr-2 shrink-0"/>
                                  <span className="truncate">{source.title}</span>
                              </a>
                          ))}
                      </div>
                  </div>
              )}
            </div>
            <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveRecord}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <BookmarkIcon className="w-5 h-5 mr-2" />
                Save for Later
              </button>
              <button
                onClick={handleRequestReview}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <UploadCloudIcon className="w-5 h-5 mr-2" />
                Request Doctor Review
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-5 animate-pulse">
    <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-2">
        <div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-7 bg-gray-200 rounded-full w-2/3"></div>
        </div>
        <div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-7 bg-gray-200 rounded-full w-1/2"></div>
        </div>
    </div>
    <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 ml-4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 ml-4"></div>
    </div>
    <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
    </div>
     <div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full ml-4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 ml-4"></div>
    </div>
  </div>
);