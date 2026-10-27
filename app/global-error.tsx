'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B1220] text-[#F1F5F9] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111C30] border border-[#263650] rounded-2xl p-8 shadow-xl text-center space-y-4">
          <h1 className="text-xl font-black text-white">System Error</h1>
          <p className="text-xs text-[#A7B4C8]">
            An unexpected error occurred in the application shell.
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
