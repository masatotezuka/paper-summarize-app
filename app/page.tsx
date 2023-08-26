"use client"
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react"

export default function Home() {
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
        }}
      >
        <Input
          placeholder="検索ワードをを入力してください"
          width={"50%"}
          sx={{ marginRight: "20px" }}
        />
        <Button colorScheme="teal" size="md">
          論文を要約する
        </Button>
      </Flex>
      <Box></Box>
    </>
  )
}
