import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { useSpeechToText } from '../useSpeechToText';
import { SendIcon } from './icons/SendIcon';
import { LinkIcon } from './icons/LinkIcon';
import { UserIcon } from './icons/UserIcon';
import { SparkIcon } from './icons/SparkIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface ChatbotProps {
  messages: ChatMessage[];
  onSubmit: (message: string) => void;
  isLoading: boolean;
  language: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ messages, onSubmit, isLoading, language }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleTranscript = useCallback((transcript: string) => {
    setInput(prev => (prev + ' ' + transcript).trim());
  }, []);
  const { isListening, toggleListening, hasSupport } = useSpeechToText({ onTranscript: handleTranscript, language });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">MedAI Knowledge Agent</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                <SparkIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}{isLoading && index === messages.length - 1 && <span className="inline-block w-2 h-4 bg-gray-600 animate-pulse ml-1" />}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200 space-y-2">
                    {msg.sources.map((source, i) => (
                        <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center text-xs text-blue-600 hover:underline transition-colors"
                        >
                            <LinkIcon className="w-3 h-3 mr-1.5 shrink-0"/>
                            <span className="truncate">{source.title}</span>
                        </a>
                    ))}
                </div>
              )}
            </div>
             {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          disabled={isLoading}
        />
        {hasSupport && (
          <button
            type="button"
            onClick={toggleListening}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5"/>
        </button>
      </form>
    </div>
  );
};