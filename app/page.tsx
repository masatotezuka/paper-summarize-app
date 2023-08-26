"use client"
import { Button, Flex, Input, Text, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { pubmedRepository } from "./repositories/pubmed.repository"
import { gptRepository } from "./repositories/gpt.repository"
import { getSummarizePaperPrompt } from "@/libs/open-ai/prompt/summarizePaperPrompt"

export default function Home() {
  const [searchWord, setSearchWord] = useState("")
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState("")
  const onClick = async () => {
    try {
      setLoading(true)
      const result = await pubmedRepository.findPaperInfoBySearchWords({
        searchWord,
      })
      setSummary(result[0].abstract)
      console.log(summary)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Text
        fontSize="4xl"
        textAlign="center"
        marginTop="150px"
        fontWeight={"bold"}
      >
        Paper Summarize App
      </Text>
      <Flex
        sx={{
          margin: "50px 0px",
          padding: "0px 20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="検索ワードを入力してください"
          width={"50%"}
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          sx={{ marginRight: "20px" }}
          disabled={loading}
          focusBorderColor="teal.400"
        />
        <Button
          colorScheme="teal"
          size="md"
          onClick={onClick}
          isDisabled={loading || searchWord === ""}
        >
          論文を要約する
        </Button>
        {loading && (
          <Spinner
            marginLeft={"20px"}
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="teal"
            size="lg"
          />
        )}
      </Flex>
      {summary && <Text>{summary}</Text>}
    </>
  )
}
