import { ReactNode } from "react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import { ThemeProvider } from "@/Components/theme-provider"

interface LayoutProps {
    children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="w-full flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex justify-center items-center">{children}</main>
                <Footer />
            </div>
        </ThemeProvider>
    )
}