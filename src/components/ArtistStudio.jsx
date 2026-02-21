import { useMemo, useState } from "react";

export default function ArtistStudio({ user, tracks, onUpload, onCreateAlbum, loading }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);

  const myTracks = useMemo(() => {
    return tracks.filter((track) => {
      const artistId = track.artist?._id || track.artist?.id || track.artist;
      return artistId === user.id;
    });
  }, [tracks, user.id]);

  function toggleTrack(id) {
    setSelectedTracks((prev) =>
      prev.includes(id) ? prev.filter((trackId) => trackId !== id) : [...prev, id]
    );
  }

  async function submitTrack(event) {
    event.preventDefault();
    if (!file) return;
    await onUpload({ title, file });
    setTitle("");
    setFile(null);
    event.target.reset();
  }

  async function submitAlbum(event) {
    event.preventDefault();
    if (!albumTitle || selectedTracks.length === 0) return;
    await onCreateAlbum({ title: albumTitle, musicIds: selectedTracks });
    setAlbumTitle("");
    setSelectedTracks([]);
  }

  if (user.role !== "artist") return null;

  return (
    <section className="panel fade-up delay-3">
      <div className="panel-head">
        <h2>Artist Studio</h2>
      </div>

      <div className="studio-grid">
        <form className="studio-form" onSubmit={submitTrack}>
          <h3>Upload New Track</h3>
          <label>
            Track title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Audio file
            <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
          </label>
          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? "Uploading..." : "Upload Track"}
          </button>
        </form>

        <form className="studio-form" onSubmit={submitAlbum}>
          <h3>Create Album</h3>
          <label>
            Album title
            <input value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
          </label>
          <div className="checklist">
            {myTracks.length === 0 && <p>No uploaded tracks yet.</p>}
            {myTracks.map((track) => {
              const id = track._id || track.id;
              return (
                <label key={id} className="check-item">
                  <input
                    type="checkbox"
                    checked={selectedTracks.includes(id)}
                    onChange={() => toggleTrack(id)}
                  />
                  {track.title}
                </label>
              );
            })}
          </div>
          <button className="btn-primary" disabled={loading} type="submit">
            {loading ? "Saving..." : "Create Album"}
          </button>
        </form>
      </div>
    </section>
  );
}
