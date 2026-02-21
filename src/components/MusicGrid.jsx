export default function MusicGrid({ tracks, onPlay, query, onQueryChange }) {
  const filtered = tracks.filter((track) =>
    `${track.title} ${track.artist?.username || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="panel fade-up delay-1">
      <div className="panel-head">
        <h2>Top Tracks</h2>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search songs or artist"
          className="search"
        />
      </div>
      <div className="track-grid">
        {filtered.map((track, index) => (
          <article
            key={track._id || track.id}
            className="track-card"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div>
              <p className="track-title">{track.title}</p>
              <p className="track-artist">{track.artist?.username || "Unknown Artist"}</p>
            </div>
            <button className="ghost" onClick={() => onPlay(track)}>
              Play
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
