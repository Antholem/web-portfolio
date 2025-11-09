import { create } from "zustand"

export type ChatMessage = {
    id: number
    sender: "user" | "bot"
    text: string
}

type ChatStore = {
    messages: ChatMessage[]
    setMessages: (messages: ChatMessage[]) => void
    addMessage: (message: ChatMessage) => void
    reset: () => void
}

const initialBotMessage: ChatMessage = {
    id: 0,
    sender: "bot",
    text: "Hi there! I'm your friendly assistant. How can I help you today?",
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [initialBotMessage],
    setMessages: (messages) =>
        set({
            messages: messages.reduce<ChatMessage[]>((accumulator, message) => {
                if (!accumulator.some((item) => item.id === message.id)) {
                    accumulator.push(message)
                }

                return accumulator
            }, []),
        }),
    addMessage: (message) =>
        set((state) => {
            const alreadyExists = state.messages.some((item) => item.id === message.id)

            if (alreadyExists) {
                return state
            }

            return { messages: [...state.messages, message] }
        }),
    reset: () => set({ messages: [initialBotMessage] }),
}))
