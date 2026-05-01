import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter-next",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-next",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-next",
  subsets: ["latin"],
});

// Import additional artistic fonts for the studio
import { 
  Montserrat, 
  Playfair_Display, 
  Lora, 
  Outfit, 
  Libre_Baskerville 
} from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const baskerville = Libre_Baskerville({ 
  weight: ["400", "700"], 
  subsets: ["latin"], 
  variable: "--font-baskerville" 
});

export const metadata: Metadata = {
  title: "Terrainly — Your terrain. Your art.",
  description: "Generate stunning, highly customizable map art and wallpapers of any location in the world.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${playfair.variable} ${lora.variable} ${outfit.variable} ${baskerville.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logos/favicon.png" sizes="any" />
        <style>{`nextjs-portal { display: none !important; }`}</style>
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
