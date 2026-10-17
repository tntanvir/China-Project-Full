import { getPcbYoutubeEmbedUrl } from "@/lib/youtube-videos";

type VideoPanelProps = {
  title: string;
  poster: string;
  embedUrl?: string;
};

export default function VideoPanel({ title, embedUrl }: VideoPanelProps) {
  const videoUrl = embedUrl ?? getPcbYoutubeEmbedUrl(title);

  return (
    <div className="aspect-video overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <iframe
        src={videoUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
