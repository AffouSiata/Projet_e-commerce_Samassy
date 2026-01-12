import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import ApiWakeUp from "@/components/ApiWakeUp";

export const metadata: Metadata = {
  title: "License Sale - Licences Numériques Authentiques",
  description: "Achetez vos licences Windows, Office, Antivirus et VPN en toute sécurité. Livraison instantanée et support technique gratuit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <ApiWakeUp />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
