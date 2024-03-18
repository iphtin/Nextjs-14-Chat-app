import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@components/ToasterContext";
import Providers from "@components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Authentication",
  description: "Build Next 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        <Providers>
        <ToasterContext />
          {children}
        </Providers>
      </body>
    </html>
  );
}
