import { create } from "zustand"

export type Message = {
    id: number
    sender: "user" | "bot"
    text: string
}

type ChatState = {
    messages: Message[]
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void
    resetMessages: () => void
}

const initialMessage: Message = {
    id: 0,
    sender: "bot",
    text: "Hi there! I'm your friendly assistant. How can I help you today?",
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [initialMessage],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),
    resetMessages: () => set({ messages: [initialMessage] }),
}))
