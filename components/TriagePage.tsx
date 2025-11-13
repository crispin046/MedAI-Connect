import React, { useState, useCallback } from 'react';
import { TriageForm } from './TriageForm';
import { TriageResultPanel } from './TriageResultPanel';
import type { PatientData, TriageResult, AnalysisType } from '../types';
import { getTriageAnalysis } from '../api/medai-api';

export const TriagePage = ({ language }: { language: string }) => {
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPatientData, setSubmittedPatientData] = useState<PatientData | null>(null);
  
  const handleTriageSubmit = useCallback(async (patientData: PatientData, type: AnalysisType) => {
    setIsLoading(true);
    setError(null);
    setTriageResult(null);
    setSubmittedPatientData(patientData);
    try {
      const result = await getTriageAnalysis(patientData, type, language);
      setTriageResult(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during triage analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TriageForm onSubmit={handleTriageSubmit} isLoading={isLoading} language={language} />
        <TriageResultPanel
          result={triageResult}
          isLoading={isLoading}
          error={error}
          language={language}
          patientData={triageResult ? submittedPatientData : null}
        />
      </div>
    </main>
  );
};