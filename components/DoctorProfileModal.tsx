import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Doctor } from '../types';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { VideoIcon } from './icons/VideoIcon';
import { CopyIcon } from './icons/CopyIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { XIcon } from './icons/XIcon';
import { LanguagesIcon } from './icons/LanguagesIcon';
import { AlertCircleIcon } from './icons/AlertCircleIcon';

const GOOGLE_MAPS_API_KEY = process.env.API_KEY;

interface DoctorProfileModalProps {
    doctor: Doctor;
    isOnline: boolean;
    onClose: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, isOnline, onClose }) => {
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const formatWhatsAppNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(doctor.contact.phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Close modal on escape key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="p-5 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                        <p className="text-md text-teal-600 font-semibold">{doctor.specialty}</p>
                    </div>
                     <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Bio */}
                    {doctor.bio && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Professional Bio</h3>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{doctor.bio}</p>
                        </div>
                    )}

                    {/* Languages & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctor.languages && doctor.languages.length > 0 && (
                            <div className="flex items-start">
                                <LanguagesIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-gray-700">Languages</h4>
                                    <p className="text-sm text-gray-600">{doctor.languages.join(', ')}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start">
                            <MailIcon className="w-5 h-5 text-gray-500 mt-0.5 mr-3 shrink-0" />
                             <div>
                                <h4 className="font-semibold text-gray-700">Email</h4>
                                <a href={`mailto:${doctor.contact.email}`} className="text-sm text-blue-600 hover:underline truncate">{doctor.contact.email}</a>
                            </div>
                        </div>
                    </div>
                    
                    {/* Map */}
                    <div>
                         <h3 className="font-semibold text-gray-800 mb-2">Clinic Location: {doctor.location.name}</h3>
                         <div className="h-48 w-full rounded-lg overflow-hidden border">
                            {GOOGLE_MAPS_API_KEY ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${doctor.location.latitude},${doctor.location.longitude}`}>
                                </iframe>
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center text-center p-4">
                                    <AlertCircleIcon className="w-8 h-8 text-yellow-500 mb-2"/>
                                    <p className="text-sm font-semibold text-yellow-700">Map Unavailable</p>
                                    <p className="text-xs text-yellow-600">The Google Maps API key is not configured.</p>
                                </div>
                            )}
                         </div>
                    </div>
                </div>

                {/* Footer with Actions */}
                <div className="p-5 border-t bg-gray-50 rounded-b-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link
                        to={`/call/${doctor.id}`}
                        onClick={(e) => !isOnline && e.preventDefault()}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <VideoIcon className="w-5 h-5" /> Video Call
                    </Link>
                    <a 
                        href={`tel:${doctor.contact.phone}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                        <PhoneIcon className="w-5 h-5" /> Phone Call
                    </a>
                    {doctor.contact.whatsapp && (
                        <a 
                            href={`https://wa.me/${formatWhatsAppNumber(doctor.contact.whatsapp)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => !isOnline && e.preventDefault()}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${isOnline ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            <WhatsappIcon className="w-5 h-5" /> WhatsApp Call
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
