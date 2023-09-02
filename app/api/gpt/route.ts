import { openAI } from "@/libs/open-ai/prompt/config"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const completion = await openAI.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613",
      messages: messages,
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
