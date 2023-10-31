import { ESEARCH_API_URL } from "@/constants"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const reqBody: { searchWords: string } = await req.json()

    const params = {
      db: "pubmed",
      term: reqBody.searchWords,
      api_key: process.env.NEXT_PUBLIC_NCBI_API_KEI || "",
      retmax: "10",
      retmode: "json",
    }
    const urlParams = new URLSearchParams(params)
    const res = await fetch(ESEARCH_API_URL + "/?" + urlParams.toString())
    const json = await res.json()
    const pmidList: number[] = json.esearchresult.idlist.map((id: string) =>
      Number(id)
    )
    return NextResponse.json({ results: { pmidList } })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
