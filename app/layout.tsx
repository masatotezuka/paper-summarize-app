import type { Metadata } from "next"
import { Providers } from "./provider"
import Main from "./Main"

export const metadata: Metadata = {
  title: "Paper Summarize App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Main>{children}</Main>
        </Providers>
      </body>
    </html>
  )
}
