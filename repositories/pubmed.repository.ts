type ScrapingResponse = {
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_PUBMED_SCRAPING_URL}`, {
      method: "POST",
      body: JSON.stringify({ searchWords }),
    })
    const data: ScrapingResponse[] = await res.json()
    return data
  },
}
