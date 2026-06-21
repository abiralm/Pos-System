import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import "../globals.css"
import { Inter } from "next/font/google"
import { AppSidebar } from "@/src/components/app-sidebar"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.variable}>
            <body>
                <SidebarProvider>
                    <AppSidebar />
                    <main className="flex-1 w-full min-w-0">
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </body>
        </html>
    )
}