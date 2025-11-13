import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { BoltIcon } from './icons/BoltIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { MapPinIcon } from './icons/MapPinIcon';

// FIX: Refactored to use a dedicated props interface and React.FC for better type safety and to resolve TS errors.
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center space-x-4 mb-3">
      <div className="bg-teal-100 text-teal-600 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{children}</p>
  </div>
);

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
          About MedAI <span className="text-teal-500">Connect</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Empowering Rural Health Workers with AI-Powered Diagnostic Support.
        </p>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            MedAI Connect is designed to bridge the healthcare gap in low-resource and rural settings. Our mission is to provide frontline health workers with an intelligent, reliable, and easy-to-use tool that enhances their diagnostic capabilities, streamlines triage processes, and ultimately improves patient outcomes. We believe that technology can be a powerful force for good, bringing advanced medical knowledge to the areas that need it most.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard icon={<BoltIcon className="w-6 h-6" />} title="Instant Triage Support">
              Receive quick and detailed patient triage summaries, including possible conditions, urgency levels, and recommended next steps based on symptoms and vitals.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6" />} title="Evidence-Based Information">
              Our AI leverages Google Search to provide up-to-date information, ensuring that the guidance provided is grounded in current medical knowledge.
            </FeatureCard>
            <FeatureCard icon={<MapPinIcon className="w-6 h-6" />} title="Location-Aware Assistance">
              Quickly find nearby clinics and hospitals using the device's geolocation, providing critical information for patient referrals.
            </FeatureCard>
             <FeatureCard icon={<GlobeIcon className="w-6 h-6" />} title="Multilingual Support">
              The app is designed to be accessible, with support for multiple languages to cater to diverse communities in rural Africa and beyond.
            </FeatureCard>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Helps</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            For a health worker in a remote clinic, access to specialist knowledge can be limited. MedAI Connect acts as a decision-support assistant. By simply inputting patient data, the worker receives a structured analysis that helps them prioritize cases, identify potential red flags, and make more informed decisions about patient care and referral. The integrated chatbot offers a conversational way to ask follow-up questions and get quick medical information, further supporting their vital work.
          </p>
        </div>
      </div>
    </div>
  );
};
