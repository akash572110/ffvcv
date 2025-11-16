import React from 'react';
import type { Message } from '../types';
import { Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const LOGO_URL = 'https://www.dropbox.com/scl/fi/u3askuvh1khb2srpbrulk/da3561ac-eed0-42e4-ba60-fad08c0fc30e.png?rlkey=mru84xggd8xqwhmv3e82sy7md&raw=1';

const UserIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white flex-shrink-0">
        U
    </div>
);

const BotIcon: React.FC = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={LOGO_URL} alt="MayuGPT Logo" className="w-full h-full object-cover" />
    </div>
);


export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const bubbleClasses = isUser
    ? 'bg-blue-600'
    : 'bg-slate-700';

  const wrapperClasses = isUser
    ? 'flex justify-end items-start gap-3'
    : 'flex justify-start items-start gap-3';

  return (
    <div className={wrapperClasses}>
      {!isUser && <BotIcon />}
      <div className={`rounded-2xl p-4 max-w-2xl text-slate-50 prose prose-invert prose-p:my-2 prose-headings:my-2 ${bubbleClasses}`}>
        {message.text ? (
          <p className="whitespace-pre-wrap">{message.text}</p>
        ) : (
          <div className="w-2 h-5 animate-pulse bg-slate-500 rounded-full"></div>
        )}
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};
