import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movie Management System",
  description: "Manage your movies with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#363636',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              fontSize: '16px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                🎬 Movie Management System
              </h1>
              <nav className="flex gap-4">
                <Link 
                  href="/" 
                  className="px-5 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-bold shadow-md hover:shadow-lg"
                >
                  🏠 Home
                </Link>
                <Link 
                  href="/create" 
                  className="px-5 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-bold shadow-md hover:shadow-lg"
                >
                  ➕ Add Movie
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
