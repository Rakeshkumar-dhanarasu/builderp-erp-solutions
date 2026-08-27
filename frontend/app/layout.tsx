import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { Inter } from "next/font/google";

// Correctly instantiate the optimized Next.js font
const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  colors: {
    brandOrange: [
      '#FDF2E2', // 0: Lightest tint (perfect for backgrounds!)
      '#FBE5C5', // 1
      '#F7CE95', // 2
      '#F2B25E', // 3
      '#ED962C', // 4
      '#E38316', // 5
      '#DC7B0A', // 6: Your exact primary hex code
      '#BA6807', // 7
      '#985404', // 8
      '#754002', // 9: Darkest shade
    ],
  },
  primaryColor: 'brandOrange',
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