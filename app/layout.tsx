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
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  )
}
