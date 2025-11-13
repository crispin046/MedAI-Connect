import React, { useState, useCallback, useRef } from 'react';
import { Chatbot } from './Chatbot';
import type { ChatMessage } from '../types';
import { findNearbyClinics, continueChatSession } from '../api/medai-api';
import type { Chat } from '@google/genai';

export const KnowledgePage = ({ language }: { language: string }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! I'm MedAI, your knowledge assistant. How can I help you today? You can ask medical questions or ask for 'nearby clinics'." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const handleChatSubmit = useCallback(async (message: string) => {
    setIsChatLoading(true);
    setError(null);
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);

    if (message.toLowerCase().includes('nearby clinics')) {
        try {
            const clinicsResult = await findNearbyClinics();
            const modelMessage = {
                role: 'model' as const,
                content: clinicsResult.text,
                sources: clinicsResult.sources,
            };
            setChatMessages(prev => [...prev, modelMessage]);
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setChatMessages(prev => [...prev, { role: 'model', content: `Sorry, I couldn't find nearby clinics. ${errorMessage}` }]);
        } finally {
            setIsChatLoading(false);
        }
        return;
    }

    try {
      setChatMessages(prev => [...prev, { role: 'model', content: '' }]);
      const { stream, chatSession } = await continueChatSession(chatRef.current, message, language);
      chatRef.current = chatSession;

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content += chunkText;
          return newMessages;
        });
      }

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = `Sorry, something went wrong. ${errorMessage}`;
          return newMessages;
      });
    } finally {
      setIsChatLoading(false);
    }
  }, [language]);

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
       <div className="h-[calc(100vh-10rem)]">
        <Chatbot
            messages={chatMessages}
            onSubmit={handleChatSubmit}
            isLoading={isChatLoading}
            language={language}
        />
       </div>
    </main>
  );
};