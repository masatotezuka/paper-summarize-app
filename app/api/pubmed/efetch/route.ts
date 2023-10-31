import { EFETCH_API_URL, PUBMED_BASE_URL } from "@/constants"
import { NextResponse } from "next/server"
import { XMLParser } from "fast-xml-parser"

const xp = new XMLParser()
export async function POST(req: Request) {
  try {
    const reqBody: { id: string } = await req.json()
    const params = {
      db: "pubmed",
      id: reqBody.id,
      api_key: process.env.NEXT_PUBLIC_NCBI_API_KEI || "",
    }
    const urlParams = new URLSearchParams(params)

    const res = await (
      await fetch(EFETCH_API_URL + "/?" + urlParams.toString())
    ).text()

    const data = xp.parse(res)
    const abstractList: string[] =
      data.PubmedArticleSet.PubmedArticle.MedlineCitation.Article.Abstract
        .AbstractText
    const abstract = abstractList.join()
    const results = {
      abstract: abstract,
      title:
        data.PubmedArticleSet.PubmedArticle.MedlineCitation.Article
          .ArticleTitle,
      url:
        PUBMED_BASE_URL +
        data.PubmedArticleSet.PubmedArticle.MedlineCitation.PMID,
    }
    return NextResponse.json({ results: results })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
