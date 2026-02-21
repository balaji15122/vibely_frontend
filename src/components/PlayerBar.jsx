function formatDuration(value) {
  if (!Number.isFinite(value)) return "0:00";
  const mins = Math.floor(value / 60);
  const secs = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onNext,
  onPrev,
}) {
  if (!currentTrack) {
    return (
      <footer className="player idle">
        <p>Select a track to start vibing.</p>
      </footer>
    );
  }

  return (
    <footer className="player">
      <div className="now-playing">
        <p className="track-title">{currentTrack.title}</p>
        <p className="track-artist">{currentTrack.artist?.username || "Unknown Artist"}</p>
      </div>

      <div className="controls">
        <button className="ghost" onClick={onPrev}>Prev</button>
        <button className="btn-primary" onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <button className="ghost" onClick={onNext}>Next</button>
      </div>

      <div className="timeline">
        <span>{formatDuration(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
        />
        <span>{formatDuration(duration)}</span>
      </div>
    </footer>
  );
}
