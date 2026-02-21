import { useEffect, useMemo, useRef, useState } from "react";
import { api, clearAuthToken, setAuthToken } from "./api";
import AuthPanel from "./components/AuthPanel";
import MusicGrid from "./components/MusicGrid";
import AlbumList from "./components/AlbumList";
import PlayerBar from "./components/PlayerBar";
import ArtistStudio from "./components/ArtistStudio";

const USER_KEY = "vibely_user";

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = useMemo(
    () => tracks.find((track) => (track._id || track.id) === currentTrackId) || null,
    [tracks, currentTrackId]
  );

  const currentIndex = useMemo(() => {
    return tracks.findIndex((track) => (track._id || track.id) === currentTrackId);
  }, [tracks, currentTrackId]);

  useEffect(() => {
    if (user) {
      loadLibrary();
    }
  }, [user]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.uri) return;
    audio.src = currentTrack.uri;
    audio.load();
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentTrack]);

  async function loadLibrary() {
    try {
      const [musicRes, albumsRes] = await Promise.all([api.getMusic(), api.getAlbums()]);
      setTracks(musicRes.music || []);
      setAlbums(albumsRes.albums || []);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAuth(mode, form) {
    setLoading(true);
    setMessage("");
    try {
      const payload =
        mode === "login"
          ? await api.login({
              username: form.username || undefined,
              email: form.email || undefined,
              password: form.password,
            })
          : await api.register(form);

      if (payload.token) {
        setAuthToken(payload.token);
      }

      if (payload.user) {
        setUser(payload.user);
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
      }
      setMessage(payload.message || "Welcome to Vibely");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload({ title, file }) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("music", file);

    setLoading(true);
    setMessage("");
    try {
      const result = await api.uploadMusic(formData);
      setMessage(result.message || "Track uploaded");
      await loadLibrary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAlbum(data) {
    setLoading(true);
    setMessage("");
    try {
      const result = await api.createAlbum(data);
      setMessage(result.message || "Album created");
      await loadLibrary();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(USER_KEY);
    clearAuthToken();
    setUser(null);
    setTracks([]);
    setAlbums([]);
    setCurrentTrackId(null);
    setMessage("Logged out");
  }

  function playPause() {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.play();
    setIsPlaying(true);
  }

  function seek(time) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }

  function playNext() {
    if (tracks.length === 0) return;
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentTrackId(tracks[nextIndex]._id || tracks[nextIndex].id);
  }

  function playPrev() {
    if (tracks.length === 0) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    setCurrentTrackId(tracks[prevIndex]._id || tracks[prevIndex].id);
  }

  if (!user) {
    return (
      <main className="shell auth-shell">
        <div className="bg-orb orb-a" />
        <div className="bg-orb orb-b" />
        <AuthPanel onLogin={handleAuth} loading={loading} />
        {message && <p className="message">{message}</p>}
      </main>
    );
  }

  return (
    <main className="shell">
      <audio
        ref={audioRef}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={playNext}
      />

      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />

      <header className="topbar fade-up">
        <div>
          <p className="eyebrow">Now Streaming</p>
          <h1>Vibely</h1>
        </div>
        <div className="topbar-right">
          <p>{user.username} • {user.role}</p>
          <button className="ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {message && <p className="message">{message}</p>}

      <MusicGrid
        tracks={tracks}
        onPlay={(track) => setCurrentTrackId(track._id || track.id)}
        query={query}
        onQueryChange={setQuery}
      />

      <AlbumList albums={albums} />

      <ArtistStudio
        user={user}
        tracks={tracks}
        onUpload={handleUpload}
        onCreateAlbum={handleCreateAlbum}
        loading={loading}
      />

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={playPause}
        onSeek={seek}
        onNext={playNext}
        onPrev={playPrev}
      />
    </main>
  );
}
