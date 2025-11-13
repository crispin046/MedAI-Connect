import React, { useState, useCallback } from 'react';
import type { PatientData, AnalysisType } from '../types';
import { useSpeechToText } from '../useSpeechToText';
import { BoltIcon } from './icons/BoltIcon';
import { BrainIcon } from './icons/BrainIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface TriageFormProps {
  onSubmit: (patientData: PatientData, type: AnalysisType) => void;
  isLoading: boolean;
  language: string;
}

const VoiceInputButton: React.FC<{isListening: boolean; onClick: () => void; hasSupport: boolean}> = ({ isListening, onClick, hasSupport }) => {
  if (!hasSupport) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`ml-2 p-1 rounded-full transition-colors ${
        isListening 
          ? 'bg-red-500 text-white animate-pulse' 
          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
      }`}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      <MicrophoneIcon className="w-4 h-4" />
    </button>
  );
};


export const TriageForm: React.FC<TriageFormProps> = ({ onSubmit, isLoading, language }) => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: '',
    symptoms: '',
    vitals: '',
    history: '',
  });
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);

  const handleSymptomsTranscript = useCallback((transcript: string) => {
    setPatientData(prev => ({ ...prev, symptoms: (prev.symptoms + ' ' + transcript).trim() }));
  }, []);
  const symptomsVoice = useSpeechToText({ onTranscript: handleSymptomsTranscript, language });

  const handleHistoryTranscript = useCallback((transcript: string) => {
    setPatientData(prev => ({ ...prev, history: (prev.history + ' ' + transcript).trim() }));
  }, []);
  const historyVoice = useSpeechToText({ onTranscript: handleHistoryTranscript, language });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (type: AnalysisType) => {
    setAnalysisType(type);
    onSubmit(patientData, type);
  };

  const isFormIncomplete = !patientData.age || !patientData.symptoms;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Triage Form</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Patient Age *</label>
          <input
            type="text"
            name="age"
            id="age"
            value={patientData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="e.g., 25 years"
            required
          />
        </div>
        <div>
          <div className="flex items-center">
            <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">Symptoms *</label>
            <VoiceInputButton 
              isListening={symptomsVoice.isListening} 
              onClick={symptomsVoice.toggleListening} 
              hasSupport={symptomsVoice.hasSupport}
            />
          </div>
          <textarea
            name="symptoms"
            id="symptoms"
            rows={4}
            value={patientData.symptoms}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="e.g., High fever, headache, joint pain"
            required
          />
        </div>
        <div>
          <label htmlFor="vitals" className="block text-sm font-medium text-gray-700">Vitals (if available)</label>
          <input
            type="text"
            name="vitals"
            id="vitals"
            value={patientData.vitals}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="e.g., Temp: 39.5°C, BP: 120/80"
          />
        </div>
        <div>
          <div className="flex items-center">
            <label htmlFor="history" className="block text-sm font-medium text-gray-700">Patient History (if available)</label>
            <VoiceInputButton 
              isListening={historyVoice.isListening} 
              onClick={historyVoice.toggleListening} 
              hasSupport={historyVoice.hasSupport}
            />
          </div>
          <textarea
            name="history"
            id="history"
            rows={3}
            value={patientData.history}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            placeholder="e.g., History of malaria, no known allergies"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSubmit('quick')}
            disabled={isLoading || isFormIncomplete}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && analysisType === 'quick' ? 'Analyzing...' : <><BoltIcon className="w-5 h-5 mr-2" /> Quick Analysis</>}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('detailed')}
            disabled={isLoading || isFormIncomplete}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && analysisType === 'detailed' ? 'Thinking...' : <><BrainIcon className="w-5 h-5 mr-2" /> Detailed Analysis</>}
          </button>
        </div>
        {isFormIncomplete && <p className="text-xs text-center text-gray-500">Please fill in Age and Symptoms to enable analysis.</p>}
      </form>
    </div>
  );
};