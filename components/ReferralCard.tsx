import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Referral } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { StopCircleIcon } from './icons/StopCircleIcon';
import { Trash2Icon } from './icons/Trash2Icon';
import { VideoIcon } from './icons/VideoIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { CopyIcon } from './icons/CopyIcon';
import { WhatsappIcon } from './icons/WhatsappIcon';
import { PhoneAlertIcon } from './icons/PhoneAlertIcon';

const AudioRecorder: React.FC<{ onRecordingComplete: (url: string) => void }> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                onRecordingComplete(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleDeleteRecording = () => {
        setAudioUrl(null);
        onRecordingComplete("");
    }

    return (
        <div className="mt-2 flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            {!audioUrl && (
                 <button
                    type="button"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                        isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border'
                    }`}
                >
                    {isRecording ? <StopCircleIcon className="w-4 h-4" /> : <MicrophoneIcon className="w-4 h-4" />}
                    {isRecording ? 'Stop' : 'Record'}
                </button>
            )}
           
            {audioUrl && (
                <>
                    <audio src={audioUrl} controls className="h-8 w-full" />
                    <button onClick={handleDeleteRecording} className="p-1.5 text-gray-500 hover:text-red-600">
                        <Trash2Icon className="w-4 h-4"/>
                    </button>
                </>
            )}
        </div>
    );
};

interface ReferralCardProps {
    referral: Referral;
    isDoctorOnline: boolean;
    onUpdate: (referral: Referral) => void;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ referral, isDoctorOnline, onUpdate }) => {
    const [showRecorder, setShowRecorder] = useState(false);
    const [showContactPopover, setShowContactPopover] = useState(false);
    const [copied, setCopied] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const formatWhatsAppNumber = (phone: string) => phone.replace(/[^0-9]/g, '');

    const handleCopy = () => {
        if (!referral.assignedDoctor) return;
        navigator.clipboard.writeText(referral.assignedDoctor.contact.phone);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setShowContactPopover(false);
        }, 1500);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowContactPopover(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleRecordingComplete = (url: string) => {
        onUpdate({ ...referral, recordedMessageUrl: url });
        setShowRecorder(false);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdate({ ...referral, doctorNotes: e.target.value });
    };

    const getStatusClass = (status: Referral['status']) => {
        return status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
               <div>
                    <p className="text-sm text-gray-500">Case ID: {referral.id}</p>
                    <p className="text-lg font-semibold text-gray-800">{referral.patientData.symptoms.substring(0, 50)}...</p>
                    <p className="text-sm text-gray-600">Patient Age: {referral.patientData.age}</p>
               </div>
                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(referral.status)}`}>
                    {referral.status}
                </span>
            </div>
           
            <div className="mt-4 border-t pt-4">
               <h3 className="font-semibold text-gray-700 mb-2">AI Triage Summary</h3>
               <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                   <div className="bg-gray-50 p-3 rounded-md">
                       <p className="font-medium text-gray-600">Urgency</p>
                       <p className="font-bold text-gray-900">{referral.triageResult.urgencyLevel}</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-md">
                       <p className="font-medium text-gray-600">Priority</p>
                       <p className="font-bold text-gray-900">{referral.triageResult.referralPriority}</p>
                   </div>
               </div>
               
               <h3 className="font-semibold text-gray-700 mb-2">Doctor Connect</h3>
                {referral.assignedDoctor && (
                    <div className="bg-gray-50 p-3 rounded-lg border mb-3">
                        <div className="flex items-center justify-between">
                             <div>
                                <p className="text-xs text-gray-500">Assigned Specialist</p>
                                <p className="font-semibold text-gray-800">{referral.assignedDoctor.name}</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowContactPopover(p => !p)}
                                    className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800"
                                >
                                    <PhoneIcon className="w-5 h-5" />
                                </button>
                                {showContactPopover && (
                                    <div ref={popoverRef} className="absolute z-10 right-0 bottom-full mb-2 w-56 bg-white border rounded-lg shadow-xl p-3 text-left animate-fade-in-up">
                                        <p className="text-sm font-bold text-gray-800">{referral.assignedDoctor.name}</p>
                                        <p className="text-xs text-gray-500 mb-3">{referral.assignedDoctor.contact.phone}</p>
                                        <div className="flex flex-col space-y-2">
                                            <button 
                                                onClick={handleCopy}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                            >
                                                <CopyIcon className="w-4 h-4" />
                                                {copied ? 'Copied!' : 'Copy Number'}
                                            </button>
                                            <a 
                                                href={`tel:${referral.assignedDoctor.contact.phone}`}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                            >
                                                <PhoneIcon className="w-4 h-4" />
                                                Call on Device
                                            </a>
                                            {referral.assignedDoctor.contact.whatsapp && (
                                                <a 
                                                    href={`https://wa.me/${formatWhatsAppNumber(referral.assignedDoctor.contact.whatsapp)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => !isDoctorOnline && e.preventDefault()}
                                                    className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors ${
                                                        isDoctorOnline ? 'bg-[#25D366] hover:bg-[#128C7E]' : 'bg-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <WhatsappIcon className="w-4 h-4" />
                                                    Call on WhatsApp
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-lg p-3">
                       <div className="flex justify-between items-center">
                           <p className="text-sm font-medium">Attach Voice Note</p>
                           {!referral.recordedMessageUrl && !showRecorder && (
                               <button onClick={() => setShowRecorder(true)} className="text-sm text-blue-600 hover:underline font-medium">Add</button>
                           )}
                       </div>
                        {showRecorder && !referral.recordedMessageUrl && (
                           <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                       )}
                       {referral.recordedMessageUrl && (
                            <div className="mt-2 flex items-center gap-2">
                                <audio src={referral.recordedMessageUrl} controls className="h-8 w-full" />
                                <button onClick={() => handleRecordingComplete("")} className="p-1.5 text-gray-500 hover:text-red-600">
                                     <Trash2Icon className="w-4 h-4"/>
                                </button>
                            </div>
                       )}
                    </div>
                     <Link
                        to={`/call/${referral.id}`}
                        className={`inline-flex items-center justify-center text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors ${
                            isDoctorOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => !isDoctorOnline && e.preventDefault()}
                    >
                        <VideoIcon className="w-5 h-5 mr-2" />
                        Video Call Doctor
                    </Link>
                </div>
                {referral.assignedDoctor && (
                     <a
                        href={`tel:${referral.assignedDoctor.contact.phone}`}
                        className="mt-3 w-full inline-flex items-center justify-center text-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors bg-red-600 hover:bg-red-700"
                    >
                        <PhoneAlertIcon className="w-5 h-5 mr-2" />
                        Emergency Call
                    </a>
                )}

                <div className="mt-3 border rounded-lg p-3">
                   <p className="text-sm font-medium mb-2">Doctor's Notes</p>
                   <textarea
                        value={referral.doctorNotes || ''}
                        onChange={handleNotesChange}
                        placeholder="Doctor can type feedback here..."
                        className="w-full text-sm text-gray-800 bg-gray-50 p-3 rounded-md min-h-[60px] border focus:ring-teal-500 focus:border-teal-500"
                   />
                </div>
            </div>
        </div>
    );
};