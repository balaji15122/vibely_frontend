export default function AlbumList({ albums }) {
  return (
    <section className="panel fade-up delay-2">
      <div className="panel-head">
        <h2>Albums</h2>
      </div>
      <div className="album-grid">
        {albums.map((album, idx) => (
          <article key={album._id || idx} className="album-card" style={{ animationDelay: `${idx * 90}ms` }}>
            <p className="album-title">{album.title}</p>
            <p className="track-artist">{album.artist?.username || "Unknown Artist"}</p>
            <p className="album-count">{Array.isArray(album.musics) ? album.musics.length : 0} tracks</p>
          </article>
        ))}
      </div>
    </section>
  );
}
