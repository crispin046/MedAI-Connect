import React, { forwardRef } from 'react';
import type { Doctor } from '../types';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface DoctorCardProps {
    doctor: Doctor;
    distance: number;
    isOnline: boolean;
    onCardClick?: () => void;
    onViewProfile: () => void;
    isSelected?: boolean;
}

export const DoctorCard = forwardRef<HTMLDivElement, DoctorCardProps>(({ doctor, distance, isOnline, onCardClick, onViewProfile, isSelected }, ref) => {
    
    return (
        <div 
          ref={ref}
          className={`bg-white p-5 rounded-xl shadow-sm border flex flex-col hover:shadow-lg transition-all cursor-pointer ${isSelected ? 'border-teal-500 ring-2 ring-teal-500' : 'border-gray-200'}`}
          onClick={onCardClick}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{doctor.specialty}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`relative flex h-3 w-3`}>
                        {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </span>
                    <span className={`text-xs font-semibold ${isOnline ? 'text-green-700' : 'text-red-700'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </div>

            <div className="text-sm text-gray-500 border-t border-b py-3 my-3 space-y-2">
                <p><span className="font-medium">Location:</span> {doctor.location.name}</p>
                {distance > 0 && <p><span className="font-medium">Distance:</span> {distance.toFixed(1)} km away</p>}
            </div>
            
            <div className="space-y-2 text-sm text-gray-700 mb-4 flex-grow">
                 <div className="flex items-center gap-2">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${doctor.contact.email}`} onClick={e => e.stopPropagation()} className="hover:underline truncate">{doctor.contact.email}</a>
                </div>
                 <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{doctor.contact.phone}</span>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile();
                }}
                className="mt-auto w-full inline-flex items-center justify-center text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                View Profile
            </button>
        </div>
    );
});