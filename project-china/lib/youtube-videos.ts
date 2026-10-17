export const pcbYoutubeEmbedUrls = [
  "https://www.youtube.com/embed/sR4ps1HVdGU?rel=0&modestbranding=1",
  "https://www.youtube.com/embed/sR4ps1HVdGU?rel=0&modestbranding=1&start=18",
  "https://www.youtube.com/embed/sR4ps1HVdGU?rel=0&modestbranding=1&start=42",
  "https://www.youtube.com/embed/sR4ps1HVdGU?rel=0&modestbranding=1&start=68",
  "https://www.youtube.com/embed/sR4ps1HVdGU?rel=0&modestbranding=1&start=96",
];

export function getPcbYoutubeEmbedUrl(seed = "pcb-video", offset = 0) {
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0),
    offset * 37,
  );

  return pcbYoutubeEmbedUrls[Math.abs(hash) % pcbYoutubeEmbedUrls.length];
}
