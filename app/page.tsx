"use client"
import { Button, Flex, Input, Text, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { pubmedRepository } from "../repositories/pubmed.repository"
import { gptRepository, ChatResponse } from "../repositories/gpt.repository"
import { getSummarizePaperPrompt } from "@/libs/open-ai/prompt/summarizePaperPrompt"
import { stringUtil } from "@/libs/util/string-util"

export default function Home() {
  const [searchWords, setSearchWords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [abstract, setAbstract] = useState("")
  const [gptResult, setGptResult] = useState<ChatResponse | null>(null)
  const onClick = async () => {
    try {
      setLoading(true)

      const result = await pubmedRepository.findPaperInfoBySearchWords({
        searchWords,
      })

      const gptResult = await gptRepository.chat({
        messages: [
          {
            role: "user",
            content: getSummarizePaperPrompt({
              abstract: result[0].abstract,
            }),
          },
        ],
      })
      setGptResult(gptResult)
      setAbstract(result[0].abstract)
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
          value={searchWords}
          onChange={(e) =>
            setSearchWords(stringUtil.splitCommasToArray(e.target.value))
          }
          sx={{ marginRight: "20px" }}
          disabled={loading}
          focusBorderColor="teal.400"
        />
        <Button
          colorScheme="teal"
          size="md"
          onClick={onClick}
          isDisabled={loading || searchWords.length === 0}
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
      {abstract && <Text>Abstract:{abstract}</Text>}
      {gptResult && <Text>目的:{gptResult.purpose}</Text>}
      {gptResult && <Text>研究デザイン:{gptResult.design}</Text>}
      {gptResult && <Text>対象者:{gptResult.subjects}</Text>}
      {gptResult && <Text>アウトカム:{gptResult.outcome}</Text>}
      {gptResult && <Text>暴露:{gptResult.exposure}</Text>}
      {gptResult && <Text>解析対象者:{gptResult.analysisSubjects}</Text>}
      {gptResult && <Text>統計解析:{gptResult.statisticalMethods}</Text>}
      {gptResult && <Text>交絡因子:{gptResult.confoundingFactors}</Text>}
      {gptResult && <Text>結果:{gptResult.results}</Text>}
      {gptResult && <Text>結論:{gptResult.conclusion}</Text>}
    </>
  )
}
