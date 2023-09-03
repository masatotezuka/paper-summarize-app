import { NextResponse } from "next/server"

const PUBMED_URL =
  "https://asia-northeast1-pubmed-scraping-397105.cloudfunctions.net/pubmed-scraping"

const LOCAL_PUBMED_URL = "http://localhost:8080/"
export async function POST(req: Request) {
  try {
    const reqBody: { searchWords: string[] } = await req.json()
    console.log(JSON.stringify(reqBody))

    const res = await fetch(PUBMED_URL, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const result = await res.json()
    return NextResponse.json({ result })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ error }, { status: 500 })
  }
}
