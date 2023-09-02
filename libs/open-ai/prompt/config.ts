import OpenAI from "openai"
export const openAI = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})
export type ChatMessage =
  OpenAI.Chat.Completions.CreateChatCompletionRequestMessage
