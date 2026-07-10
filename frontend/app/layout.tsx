import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Inter } from "next/font/google";

// Correctly instantiate the optimized Next.js font
const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  primaryColor: "indigo",
  defaultRadius: "md",
  fontFamily: inter.style.fontFamily, // Bind it to Mantine globally
});

export const metadata = {
  title: "Builderp ERP Solutions",
  description: "Enterprise Operations Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      {/* Inject the font className to handle standard elements */}
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}