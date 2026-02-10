'use client';

interface EmbedFallbackProps {
  url: string;
  title: string;
}

export function EmbedFallback({ url, title }: EmbedFallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/90">
      <p className="text-lg text-white">
        <span className="font-bold text-green-400">{title}</span> cannot be
        embedded
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded bg-green-500 px-6 py-2 font-bold text-black transition hover:bg-green-400"
      >
        Open in New Tab
      </a>
    </div>
  );
}
