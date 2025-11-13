import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserIcon } from './icons/UserIcon';
import { MicOffIcon } from './icons/MicOffIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { VideoOffIcon } from './icons/VideoOffIcon';
import { VideoIcon } from './icons/VideoIcon';
import { PhoneOffIcon } from './icons/PhoneOffIcon';

export const VideoCallPage: React.FC = () => {
    const { referralId } = useParams();
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const startMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices.", error);
                alert("Could not access camera and microphone. Please check permissions.");
                navigate('/referrals');
            }
        };

        startMedia();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [navigate]);

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(prev => !prev);
        }
    };

    const toggleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsVideoOff(prev => !prev);
        }
    };
    
    const handleEndCall = () => {
        // Stop media tracks already handled in cleanup
        navigate('/referrals');
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-white flex flex-col relative">
            <div className="absolute top-4 left-4 text-sm bg-black bg-opacity-50 p-2 rounded">
                <p>Case ID: {referralId}</p>
            </div>
            
            {/* Remote Video (Doctor) */}
            <div className="flex-1 bg-gray-800 flex items-center justify-center">
                 <div className="flex flex-col items-center text-gray-400">
                    <UserIcon className="w-24 h-24" />
                    <p className="mt-2">Connecting to Doctor...</p>
                </div>
            </div>

            {/* Local Video (Health Worker) */}
            <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-6 w-32 h-40 sm:w-48 sm:h-64 bg-gray-700 rounded-lg shadow-lg overflow-hidden border-2 border-gray-600">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                 {isVideoOff && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        <VideoOffIcon className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 p-4">
                <div className="flex justify-center items-center space-x-4">
                     <button
                        onClick={toggleMute}
                        className={`p-3 rounded-full transition-colors ${
                            isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOffIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                    </button>
                     <button
                        onClick={toggleVideo}
                        className={`p-3 rounded-full transition-colors ${
                            isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
                    >
                        {isVideoOff ? <VideoOffIcon className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={handleEndCall}
                        className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                        aria-label="End call"
                    >
                        <PhoneOffIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};
