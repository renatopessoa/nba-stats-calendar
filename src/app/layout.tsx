import Navbar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "NBA Stats Calendar",
    description: "Calendário e estatísticas da NBA em tempo real",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="container py-4 px-4 sm:px-6">{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
