import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@components/Providers";
import TopBar from "@components/TopBar";
import BottomBar from "@components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Iphtin Chat",
  description: "Next.js 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-2`}>
        <Providers>
          <TopBar />
        {children}
        <BottomBar />
        </Providers>
      </body>
    </html>
  );
}
