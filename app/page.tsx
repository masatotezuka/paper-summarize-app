"use client"
import {
  Button,
  Flex,
  Input,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react"
import { useState } from "react"
import {
  pubmedRepository,
  FetchSummaryResult,
} from "../repositories/pubmed.repository"
import { gptRepository, ChatResponse } from "../repositories/gpt.repository"
import { getSummarizePaperPrompt } from "@/libs/open-ai/prompt/summarizePaperPrompt"
import { utils, writeFile } from "xlsx"

type Summary = ChatResponse & FetchSummaryResult
export default function Home() {
  const [searchWords, setSearchWords] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [summaries, setSummaries] = useState<Summary[] | null>(null)
  const [hasError, setHasError] = useState(false)
  const onClickSummarize = async () => {
    try {
      if (hasError) {
        setHasError(false)
      }
      setLoading(true)
      const res = await pubmedRepository.search({ searchWords })
      const gptResponse = await Promise.all(
        res.pmidList.map(async (id) => {
          const fetchResult = await pubmedRepository.fetchSummary({
            id,
          })
          const res =
            fetchResult &&
            (await gptRepository.chat({
              messages: [
                {
                  role: "user",
                  content: getSummarizePaperPrompt({
                    abstract: fetchResult.abstract,
                  }),
                },
              ],
            }))
          return { ...res, ...fetchResult }
        })
      )
      setSummaries(gptResponse.filter((res) => Object.keys(res).length !== 0))
    } catch (error) {
      setHasError(true)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onClickDownload = () => {
    if (summaries === null) {
      return
    }
    const ws = utils.json_to_sheet(summaries)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws)
    writeFile(wb, "papper_summary.xlsx")
  }
  const showSummaries = !loading && summaries && summaries.length !== 0

  return (
    <>
      <Text
        fontSize="4xl"
        textAlign="center"
        marginTop="50px"
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
          onChange={(e) => setSearchWords(e.target.value)}
          sx={{ marginRight: "20px" }}
          disabled={loading}
          focusBorderColor="teal.400"
        />
        <Button
          colorScheme="teal"
          size="md"
          onClick={onClickSummarize}
          isDisabled={loading || searchWords.length === 0}
        >
          論文を要約する
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          margin={"0px 20px"}
          onClick={onClickDownload}
          isDisabled={loading || searchWords.length === 0 || !showSummaries}
        >
          ダウンロード
        </Button>
      </Flex>
      {hasError && (
        <Flex
          sx={{
            justifyContent: "center",
          }}
        >
          <Text fontSize={"xl"} sx={{ fontWeight: "bold" }}>
            エラーが発生しました。再度お試しください。
          </Text>
        </Flex>
      )}
      {loading && (
        <Flex
          sx={{
            margin: "80px 0px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Spinner
            marginLeft={"20px"}
            thickness="4px"
            speed="0.8s"
            emptyColor="gray.200"
            color="teal"
            size="xl"
          />
          <Text sx={{ marginTop: "30px" }}>
            論文を要約しています。しばらくお待ちください。
          </Text>
        </Flex>
      )}
      {showSummaries && (
        <TableContainer
          sx={{
            height: "70vh",
          }}
          overflowY={"scroll"}
          overflowX={"scroll"}
        >
          <Table variant="simple" size={"sm"}>
            <Thead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: "white",
                marginBottom: "20px",
              }}
            >
              <Tr>
                <Th
                  textAlign={"center"}
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: "white",
                  }}
                >
                  論文タイトル
                </Th>
                <Th textAlign={"center"}>研究目的</Th>
                <Th textAlign={"center"}>研究デザイン</Th>
                <Th textAlign={"center"}>対象者</Th>
                <Th textAlign={"center"}>アウトカム</Th>
                <Th textAlign={"center"}>暴露</Th>
                <Th textAlign={"center"}>解析対象者</Th>
                <Th textAlign={"center"}>統計解析</Th>
                <Th textAlign={"center"}>交絡因子</Th>
                <Th textAlign={"center"}>結果</Th>
                <Th textAlign={"center"}>結論</Th>
                <Th textAlign={"center"}>Abstract</Th>
              </Tr>
            </Thead>
            <Tbody>
              {summaries.map((summary, i) => (
                <Tr key={i}>
                  <Td
                    minWidth={"200px"}
                    whiteSpace={"normal"}
                    sx={{
                      position: "sticky",
                      backgroundColor: "white",
                      left: 0,

                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    <Text
                      onClick={() => window.open(summary.url, "_blank")}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      {summary.title}
                    </Text>
                  </Td>
                  <Td minWidth={"300px"} whiteSpace={"normal"}>
                    {summary.purpose ?? "-"}
                  </Td>
                  <Td minWidth={"300px"} whiteSpace={"normal"}>
                    {summary.design ?? "-"}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.subjects}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.outcome ?? "-"}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.exposure ?? "-"}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.analysisSubjects ?? "-"}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.statisticalMethods ?? "-"}
                  </Td>
                  <Td minWidth={"250px"} whiteSpace={"normal"}>
                    {summary.confoundingFactors ?? "-"}
                  </Td>
                  <Td minWidth={"300px"} whiteSpace={"normal"}>
                    {summary.results ?? "-"}
                  </Td>
                  <Td minWidth={"300px"} whiteSpace={"normal"}>
                    {summary.conclusion ?? "-"}
                  </Td>
                  <Td minWidth={"600px"} whiteSpace={"normal"}>
                    {summary.abstract ?? "-"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}
