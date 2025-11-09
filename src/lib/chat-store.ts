import { create } from "zustand";

export type Message = {
    id: number;
    sender: "user" | "bot";
    text: string;
};

type ChatState = {
    messages: Message[];
    isResponding: boolean;
    hasUnread: boolean;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setIsResponding: (state: boolean) => void;
    setHasUnread: (state: boolean) => void;
    resetMessages: () => void;
};

const initialMessage: Message = {
    id: 0,
    sender: "bot",
    text: "Hi there! I'm your friendly assistant. How can I help you today?",
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [initialMessage],
    isResponding: false,
    hasUnread: false,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
            hasUnread: message.sender === "bot" ? true : state.hasUnread,
        })),
    setIsResponding: (state) => set({ isResponding: state }),
    setHasUnread: (state) => set({ hasUnread: state }),
    resetMessages: () => set({ messages: [initialMessage], hasUnread: false }),
}));
