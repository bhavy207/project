import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevPilot — Autonomous AI Developer Platform ($0 Budget)',
  description: 'Self-hosted AI pair programmer with zero mandatory paid services.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-devpilot-bg text-gray-100 flex flex-col min-h-screen">
        <header className="border-b border-devpilot-border bg-devpilot-surface/80 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              DP
            </div>
            <div>
              <h1 className="font-semibold text-base leading-none text-white flex items-center gap-2">
                DevPilot
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                  $0 Budget Verified
                </span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Autonomous AI Pair Programmer</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-2.5 py-1.5 rounded-md transition"
            >
              📊 Grafana
            </a>
            <a
              href="http://localhost:8025"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-2.5 py-1.5 rounded-md transition"
            >
              ✉️ Mailpit
            </a>
            <a
              href="https://github.com/bhavy207/project.git"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1.5 rounded-md transition"
            >
              GitHub Repo
            </a>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-devpilot-border py-4 px-6 text-center text-xs text-gray-500 bg-devpilot-surface">
          DevPilot Architecture • 100% Free / Open Source Software • Zero Mandatory Paid SaaS
        </footer>
      </body>
    </html>
  );
}
