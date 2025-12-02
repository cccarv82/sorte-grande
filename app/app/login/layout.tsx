import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Sorte Grande",
  description: "Entre com seu email para acessar o Sorte Grande",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
