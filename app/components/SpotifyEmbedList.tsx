export default async function SpotifyEmbedList({
  spotifyEpisodeURLs,
}: {
  spotifyEpisodeURLs: string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-center text-6xl font-bold md:text-8xl">EPISODES</div>
      <div className="flex flex-col gap-4">
        {spotifyEpisodeURLs.map((src) => (
          <iframe
            title="spotify-embed"
            src={src}
            loading="lazy"
            key={src}
            className="h-[152px]"
          ></iframe>
        ))}
      </div>
    </div>
  );
}
