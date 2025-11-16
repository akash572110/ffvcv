import React from 'react';
import type { Conversation } from '../types';

interface HistorySidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onNewChat: () => void;
  onLoadChat: (id: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.158 2.148.279 3.238.364.494.033.99.064 1.485.093v-2.16a2.25 2.25 0 00-2.25-2.25H4.5m16.5.75c0-1.6-1.123-2.994-2.707-3.227-1.068-.158-2.148-.279-3.238-.364-.494-.033-.99-.064-1.485-.093V21a2.25 2.25 0 002.25-2.25h.513c1.684 0 3.022-1.226 3.22-2.882.163-.99.254-2.016.254-3.061V12.76zM4.5 12a2.25 2.25 0 00-2.25 2.25v.513c0 1.684 1.226 3.022 2.882 3.22.99.163 2.016.254 3.061.254h.041a2.25 2.25 0 002.25-2.25v-2.16" />
    </svg>
);


export const HistorySidebar: React.FC<HistorySidebarProps> = ({ conversations, activeId, onNewChat, onLoadChat, isOpen, setIsOpen }) => {
  const handleLoadChat = (id: string) => {
    onLoadChat(id);
    setIsOpen(false);
  };

  const handleNewChat = () => {
    onNewChat();
    setIsOpen(false);
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`absolute md:relative flex flex-col w-64 bg-slate-950 text-slate-200 h-full flex-shrink-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-slate-700 rounded-md hover:bg-slate-800 transition-colors"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <a
              key={conv.id}
              href="#"
              onClick={(e) => { e.preventDefault(); handleLoadChat(conv.id); }}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                conv.id === activeId ? 'bg-slate-800 font-semibold' : 'hover:bg-slate-800/50'
              }`}
            >
              <ChatIcon />
              <span className="truncate flex-1">{conv.title}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};
