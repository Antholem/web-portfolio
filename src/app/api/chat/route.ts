import { NextResponse } from "next/server"

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-2.0-flash"
const GENERATE_CONTENT_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`

type ChatRole = "user" | "assistant"

type ChatMessage = {
    role: ChatRole
    content: string
}

type GeminiPart = {
    text?: string
}

type GeminiContent = {
    role: "user" | "model" | "system"
    parts: GeminiPart[]
}

type GeminiCandidate = {
    content?: {
        parts?: GeminiPart[]
    }
}

type GeminiResponse = {
    candidates?: GeminiCandidate[]
    promptFeedback?: {
        blockReason?: string
    }
    error?: {
        message?: string
    }
}

type ChatRequestBody = {
    messages?: ChatMessage[]
}

const buildContents = (messages: ChatMessage[]): GeminiContent[] =>
    messages.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
    }))

const extractReply = (payload: GeminiResponse): string | null => {
    if (!payload.candidates?.length) {
        return null
    }

    const [candidate] = payload.candidates
    const parts = candidate.content?.parts

    if (!parts?.length) {
        return null
    }

    return parts
        .map((part) => (typeof part.text === "string" ? part.text : ""))
        .join("")
        .trim()
}

const sanitizeMessages = (messages: ChatMessage[] | undefined): ChatMessage[] => {
    if (!messages) {
        return []
    }

    return messages
        .map((message) => ({
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.content?.trim() ?? "",
        }))
        .filter((message): message is ChatMessage => Boolean(message.content))
}

export async function POST(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        return NextResponse.json(
            { error: "Gemini API key is not configured." },
            { status: 500 }
        )
    }

    let body: ChatRequestBody

    try {
        body = (await request.json()) as ChatRequestBody
    } catch {
        return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
    }

    const messages = sanitizeMessages(body.messages)

    if (!messages.length) {
        return NextResponse.json(
            { error: "At least one message is required to continue the conversation." },
            { status: 400 }
        )
    }

    const contents = buildContents(messages)

    try {
        const response = await fetch(`${GENERATE_CONTENT_ENDPOINT}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents,
                systemInstruction: {
                    role: "system",
                    parts: [
                        {
                            text: [
                                "You are a helpful AI assistant embedded inside a personal portfolio website.",
                                "Answer each question clearly and concisely using Markdown when it improves readability.",
                                "If you do not know the answer, be honest and offer helpful suggestions for finding it.",
                                "Keep responses welcoming and professional, and avoid fabricating details about the user.",
                            ].join("\n"),
                        },
                    ],
                },
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 512,
                },
            }),
        })

        if (!response.ok) {
            let errorPayload: GeminiResponse | undefined

            try {
                errorPayload = (await response.json()) as GeminiResponse
            } catch {
                // ignore JSON parsing errors
            }

            const errorMessage =
                errorPayload?.error?.message ??
                errorPayload?.promptFeedback?.blockReason ??
                `Gemini API returned status ${response.status}.`

            return NextResponse.json({ error: errorMessage }, { status: response.status })
        }

        const payload = (await response.json()) as GeminiResponse
        const reply = extractReply(payload)

        if (!reply) {
            return NextResponse.json(
                { error: "The assistant responded with an empty message. Please try again." },
                { status: 502 }
            )
        }

        return NextResponse.json({ reply })
    } catch (error) {
        const message =
            error instanceof Error && error.message
                ? error.message
                : "Unexpected error while contacting Gemini API."

        return NextResponse.json({ error: message }, { status: 500 })
    }
}
