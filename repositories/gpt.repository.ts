import { ChatMessage } from "@/app/api/gpt/route"

export type ChatResponse = {
  purpose: string | null
  analysisSubjects: string | null
  conclusion: string | null
  confoundingFactors: string | null
  design: string | null
  exposure: string | null
  limitations: string | null
  outcome: string | null
  results: string | null
  statisticalMethods: string | null
  subjects: string | null
}

export const gptRepository = {
  async chat({ messages }: { messages: ChatMessage[] }): Promise<ChatResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gpt`, {
      method: "POST",
      body: JSON.stringify({ messages }),
    })
    const data = await res.json()
    return JSON.parse(data.result)
  },
}
