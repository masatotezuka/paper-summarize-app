export type ScrapingResponse = {
  title: string
  abstract: string
  pubmedUrl: string
  originUrl: string
}

export const pubmedRepository = {
  async findPaperInfoBySearchWords({
    searchWords,
  }: {
    searchWords: string[]
  }): Promise<ScrapingResponse[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pubmed`, {
      method: "POST",
      body: JSON.stringify({ searchWords }),
    })
    const data = await res.json()
    return data.result
  },
}
