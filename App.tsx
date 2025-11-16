import React, { useRef, useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { HistorySidebar } from './components/HistorySidebar';
import { useChat } from './hooks/useChat';
import { Sender } from './types';

const LOGO_URL = 'https://www.dropbox.com/scl/fi/u3askuvh1khb2srpbrulk/da3561ac-eed0-42e4-ba60-fad08c0fc30e.png?rlkey=mru84xggd8xqwhmv3e82sy7md&raw=1';

const Welcome: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <img src={LOGO_URL} alt="MayuGPT Logo" className="w-24 h-24 mb-6 rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-slate-100">MayuGPT</h1>
        <p className="mt-2 text-lg text-slate-400">Your highly advanced AI assistant.</p>
        <p className="mt-4 text-slate-500">Start a conversation below to get started.</p>
    </div>
);


const App: React.FC = () => {
  const { messages, conversations, isLoading, sendMessage, startNewChat, loadChat, activeConversationId } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isAiResponding = isLoading && messages.length > 0 && messages[messages.length - 1]?.sender === Sender.User;

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans overflow-hidden">
      <HistorySidebar 
        conversations={conversations}
        activeId={activeConversationId}
        onNewChat={startNewChat}
        onLoadChat={loadChat}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-1 h-screen min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            {activeConversationId ? (
                <div className="space-y-6">
                    {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                    ))}
                    {isAiResponding && (
                    <div className="flex justify-start">
                        <div className="bg-slate-700 rounded-2xl p-4 max-w-2xl">
                            <LoadingIndicator />
                        </div>
                    </div>
                    )}
                </div>
            ) : (
                <Welcome />
            )}
        </main>
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
