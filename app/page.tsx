"use client"
import {
  Button,
  Flex,
  Input,
  Text,
  Spinner,
  Divider,
  Box,
} from "@chakra-ui/react"
import { useState } from "react"
import { pubmedRepository } from "../repositories/pubmed.repository"
import { gptRepository, ChatResponse } from "../repositories/gpt.repository"
import { getSummarizePaperPrompt } from "@/libs/open-ai/prompt/summarizePaperPrompt"
import { stringUtil } from "@/libs/util/string-util"
import { utils, writeFile } from "xlsx"

export default function Home() {
  const [searchWords, setSearchWords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [abstract, setAbstract] = useState("")
  const [summaries, setSummaries] = useState<ChatResponse[] | null>(null)
  const onClick = async () => {
    try {
      setLoading(true)

      const result = await pubmedRepository.findPaperInfoBySearchWords({
        searchWords,
      })

      const gptResponse = await Promise.all(
        result.map(async (paper) => {
          const res = await gptRepository.chat({
            messages: [
              {
                role: "user",
                content: getSummarizePaperPrompt({
                  abstract: paper.abstract,
                }),
              },
            ],
          })
          return res
        })
      )
      const ws = utils.json_to_sheet(gptResponse)
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws)
      writeFile(wb, "papper_summary.xlsx")
      setSummaries(gptResponse)
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
      {/* TODO:レイアウト修正 */}
      {/* {summaries && <Text>`${summaries}`</Text>} */}
      {summaries &&
        summaries.map((s, i) => (
          <Box key={i}>
            <Flex>
              <Text>目的:{s.purpose}</Text>
              <Text>研究デザイン:{s.design}</Text>
              <Text>対象者:{s.subjects}</Text>
              <Text>アウトカム:{s.outcome}</Text>
              <Text>暴露:{s.exposure}</Text>
              <Text>解析対象者:{s.analysisSubjects}</Text>
              <Text>統計解析:{s.statisticalMethods}</Text>
              <Text>交絡因子:{s.confoundingFactors}</Text>
              <Text>結果:{s.results}</Text>
              <Text>結論:{s.conclusion}</Text>
            </Flex>
            <Divider border={"1px solid #ccc"} />
          </Box>
        ))}
    </>
  )
}
