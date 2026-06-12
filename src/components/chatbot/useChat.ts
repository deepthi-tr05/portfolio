import { useState, useCallback, useRef } from 'react';
import { generateReply, type ChatMessage } from '../../lib/aiEngine';
import { profile } from '../../data/portfolio';

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `NOVA online. I'm ${profile.name}'s portfolio intelligence — ask me about her projects, skills, certifications or experience.`,
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [isTyping, setIsTyping] = useState(false);
  const pendingRef = useRef(false);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pendingRef.current) return;

    pendingRef.current = true;
    const userMsg: ChatMessage = { id: nextId(), role: 'user', content: trimmed };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = [...messages, userMsg];
      const reply = await generateReply(history);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: reply.content,
          navigateTo: reply.navigateTo,
          action: reply.action,
          contactPurpose: reply.contactPurpose,
        },
      ]);
    } finally {
      setIsTyping(false);
      pendingRef.current = false;
    }
  }, [messages]);

  /** Inject an assistant message directly (e.g. system confirmations, mode activations) */
  const addAssistantMessage = useCallback(
    (content: string, extras?: Pick<ChatMessage, 'action' | 'contactPurpose' | 'navigateTo'>) => {
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content, ...extras }]);
    },
    []
  );

  const resetChat = useCallback(() => {
    setMessages([WELCOME]);
    setIsTyping(false);
    pendingRef.current = false;
  }, []);

  return { messages, isTyping, sendMessage, addAssistantMessage, resetChat };
};
