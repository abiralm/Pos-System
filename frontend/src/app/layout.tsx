import "./globals.css"
import { Jost } from "next/font/google"

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
          <main className="flex-1 w-full min-w-0">
            {children}
          </main>
      </body>
    </html>
  )
}