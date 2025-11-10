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
    isChatOpen: boolean;
    inputDraft: string;
    scrollPosition: number;
    isAtBottom: boolean;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setIsResponding: (state: boolean) => void;
    setHasUnread: (state: boolean) => void;
    setIsChatOpen: (state: boolean) => void;
    setInputDraft: (value: string) => void;
    setScrollPosition: (value: number) => void;
    setIsAtBottom: (value: boolean) => void;
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
    isChatOpen: false,
    inputDraft: "",
    scrollPosition: 0,
    isAtBottom: true,
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
            hasUnread:
                message.sender === "bot" && !state.isChatOpen ? true : state.hasUnread,
        })),
    setIsResponding: (state) => set({ isResponding: state }),
    setHasUnread: (state) => set({ hasUnread: state }),
    setIsChatOpen: (state) =>
        set((prevState) => ({
            isChatOpen: state,
            hasUnread: state ? false : prevState.hasUnread,
        })),
    setInputDraft: (value) => set({ inputDraft: value }),
    setScrollPosition: (value) => set({ scrollPosition: value }),
    setIsAtBottom: (value) => set({ isAtBottom: value }),
    resetMessages: () =>
        set({
            messages: [initialMessage],
            hasUnread: false,
            inputDraft: "",
            scrollPosition: 0,
            isAtBottom: true,
        }),
}));
