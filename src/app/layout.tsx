import '../globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        <header className="p-6 bg-white shadow-sm flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-blue-600">Rexus Tech Pulse</a>
          <nav className="space-x-4">
            <a href="/admin" className="text-sm text-gray-500">Admin</a>
          </nav>
        </header>
        
        <main className="min-h-screen container mx-auto p-4">
          {children}
        </main>

        <footer className="p-6 text-center text-gray-500 text-sm">
          © 2026 Rexus Tech Pulse. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
