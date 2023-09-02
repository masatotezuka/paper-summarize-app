"use client"
import { Container } from "@chakra-ui/react"

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <Container as="main" maxW="container">
      {children}
    </Container>
  )
}
