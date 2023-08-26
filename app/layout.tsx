import type { Metadata } from "next"
import { Providers } from "./provider"

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
