type ScrapingResponse = {
  title: string
  abstract: string
  pubmedUrl: string
  originUrl: string
}

export const pubmedRepository = {
  async findPaperInfoBySearchWords({
    searchWord,
  }: {
    searchWord: string
  }): Promise<ScrapingResponse[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PUBMED_SCRAPING_URL}`, {
      method: "POST",
      body: JSON.stringify({ searchWord }),
    })
    const data: ScrapingResponse[] = await res.json()
    return data
  },
}
