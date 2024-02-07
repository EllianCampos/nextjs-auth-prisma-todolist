import "./globals.css";
import Bootstrap from "@/components/Bootstrap";
import Navbar from "@/components/Navbar";
import Providers from "./Providers";

export const metadata = {
  title: "Gestor de tareas",
  description: "Gestiona tus tareas fácilmente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Bootstrap />
        </Providers>
      </body>
    </html>
  );
}