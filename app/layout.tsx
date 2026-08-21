import { ThemeProvider } from "@/shared/components/theme-provider"
import { cn } from "@/shared/lib/utils"
import { Inter, JetBrains_Mono, Noto_Serif } from "next/font/google"
import "./globals.css"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
})
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-sans",
        fontHeading.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
