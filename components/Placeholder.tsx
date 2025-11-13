
import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

export const Placeholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <ClipboardIcon className="w-16 h-16 mb-4 text-gray-300" />
      <h3 className="font-semibold text-lg text-gray-700">Triage results will appear here</h3>
      <p className="max-w-sm mt-1 text-sm">
        Complete the patient form and click one of the analysis buttons to get an AI-powered triage summary.
      </p>
    </div>
  );
};
