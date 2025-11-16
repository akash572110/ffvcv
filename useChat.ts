import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Message, Conversation } from '../types';
import { Sender } from '../types';

const API_KEY = process.env.API_KEY;
const HISTORY_STORAGE_KEY = 'mayugpt_chat_history';

const newSystemInstruction = `You are a highly advanced AI assistant. Your job is to produce responses that are extremely smooth, polished, well-structured, and professional—similar to top-tier systems like Gemini, ChatGPT, and Claude.

When answering:

- Use clear, natural, human-like language.
- Format content with headings, bullet points, and spacing.
- Keep tone friendly, confident, and expert.
- Avoid unnecessary filler.
- Provide deep, accurate, and helpful explanations.
- If giving code, ensure it is clean, neat, and fully functional.
- If giving instructions, provide step-by-step guidance.
- If generating UI, prompts, or app ideas, make them modern, premium, and creative.
- Always maintain a high-quality professional writing style.
`;

const createChatSession = (history?: any[]) => {
  if (!API_KEY) {
    console.error("API_KEY is not set.");
    return null;
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  // The 'history' type for chats.create is based on the Content type from the SDK
  const typedHistory: { role: string; parts: { text: string }[] }[] | undefined = history;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: typedHistory,
    config: {
      systemInstruction: newSystemInstruction,
    },
  });
};

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);

  // Load from storage on initial render
  useEffect(() => {
    try {
      const storedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setConversations(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse chat history from localStorage", error);
    }
    setChat(createChatSession());
  }, []);
  
  // Save to storage whenever conversations change
  useEffect(() => {
    // Check if there are conversations to prevent overwriting on initial empty load
    if (conversations && conversations.length > 0) {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation ? activeConversation.messages : [];

  const startNewChat = useCallback(() => {
    setActiveConversationId(null);
    setChat(createChatSession()); // Create a fresh chat session
  }, []);

  const loadChat = useCallback((id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;

    const history = conversation.messages.map(msg => ({
      role: msg.sender === Sender.User ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    setChat(createChatSession(history));
    setActiveConversationId(id);
  }, [conversations]);

  const sendMessage = useCallback(async (text: string) => {
    if (isLoading || !chat) {
      return;
    }

    setIsLoading(true);
    const userMessage: Message = { id: Date.now().toString(), text, sender: Sender.User };
    
    let currentConversationId = activeConversationId;
    
    if (!currentConversationId) {
        // This is a new chat
        const newConversationId = Date.now().toString();
        const newConversation: Conversation = {
            id: newConversationId,
            title: text.length > 40 ? `${text.substring(0, 37)}...` : text,
            messages: [userMessage],
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversationId);
        currentConversationId = newConversationId;
    } else {
        // Add to existing chat
        setConversations(prev => prev.map(c => 
            c.id === currentConversationId 
            ? { ...c, messages: [...c.messages, userMessage] } 
            : c
        ));
    }

    try {
      const stream = await chat.sendMessageStream({ message: text });
      let aiResponseText = '';
      const aiMessageId = Date.now().toString() + '-ai';

      // Add a placeholder for the AI response
      setConversations(prev => prev.map(c => 
          c.id === currentConversationId 
          ? { ...c, messages: [...c.messages, { id: aiMessageId, text: '', sender: Sender.AI }] } 
          : c
      ));
      
      for await (const chunk of stream) {
        aiResponseText += chunk.text;
        setConversations(prev => prev.map(c => {
            if (c.id === currentConversationId) {
                const updatedMessages = c.messages.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: aiResponseText } : msg
                );
                return { ...c, messages: updatedMessages };
            }
            return c;
        }));
      }
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = {
          id: Date.now().toString() + '-error',
          text: "I'm sorry, but I'm having trouble connecting right now. Please try again later.",
          sender: Sender.AI
      };
      setConversations(prev => prev.map(c => 
          c.id === currentConversationId 
          ? { ...c, messages: [...c.messages, errorMessage] } 
          : c
      ));
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, activeConversationId, conversations]);

  return { messages, conversations, isLoading, sendMessage, startNewChat, loadChat, activeConversationId };
};
