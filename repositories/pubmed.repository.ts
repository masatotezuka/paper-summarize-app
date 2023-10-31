export type SearchResult = {
  ids: number[]
}

export type FetchSummaryResult = {
  abstract: string
  title: string
  url: string
}
export const pubmedRepository = {
  async search({
    searchWords,
  }: {
    searchWords: string
  }): Promise<SearchResult> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pubmed/esearch`,
      {
        method: "POST",
        body: JSON.stringify({ searchWords }),
      }
    )
    const data = await res.json()
    return data.results
  },

  async fetchSummary({ id }: { id: number }): Promise<FetchSummaryResult> {
    console.log(id)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pubmed/efetch`,
      {
        method: "POST",
        body: JSON.stringify({ id }),
      }
    )
    const data = await res.json()
    return data.results
  },
}
