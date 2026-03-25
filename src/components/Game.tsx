import { useEffect, useState } from "react";
import Glass from "./Glass";

interface GameMeta {
  name: string;
  description: string;
  creator: string;
  playing: number;
  visits: number;
  favoritedCount: number;
  thumbnail: string | null;
}

async function fetchGameMeta(placeId: string): Promise<GameMeta> {
  const universeRes = await fetch(
    `https://apis.roproxy.com/universes/v1/places/${placeId}/universe`,
  );
  if (!universeRes.ok) throw new Error("Failed to fetch universeId");
  const { universeId } = await universeRes.json();

  const gameRes = await fetch(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
  if (!gameRes.ok) throw new Error("Failed to fetch game data");
  const gameData = await gameRes.json();
  const game = gameData.data[0];

  const thumbRes = await fetch(
    `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
  );
  if (!thumbRes.ok) throw new Error("Failed to fetch thumbnail");
  const thumbData = await thumbRes.json();
  const thumbnail: string | null = thumbData.data?.[0]?.imageUrl ?? null;

  return {
    name: game.name,
    description: game.description,
    creator: game.creator.name,
    playing: game.playing,
    visits: game.visits,
    favoritedCount: game.favoritedCount,
    thumbnail,
  };
}

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function RobloxGameCard({ PlaceId }: { PlaceId: string }) {
  const [meta, setMeta] = useState<GameMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameMeta(PlaceId)
      .then(setMeta)
      .catch((e) => setError(e.message));
  }, [PlaceId]);

  return (
    <Glass className="w-64 overflow-hidden border-white/10 flex flex-col">
      {/* Thumbnail */}
      <div className="w-full h-36 bg-white/5 shrink-0">
        {meta?.thumbnail ? (
          <img src={meta.thumbnail} alt={meta.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full animate-pulse bg-white/10" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {error ? (
          <div className="flex flex-col gap-1">
            <p className="text-red-400 text-sm font-medium">Failed to load</p>
            <p className="text-white/30 text-xs">{error}</p>
          </div>
        ) : !meta ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-3/4 rounded-md bg-white/10 animate-pulse" />
            <div className="h-3 w-1/2 rounded-md bg-white/10 animate-pulse" />
            <div className="h-3 w-full rounded-md bg-white/10 animate-pulse mt-1" />
            <div className="flex gap-4 mt-2">
              <div className="h-6 w-10 rounded-md bg-white/10 animate-pulse" />
              <div className="h-6 w-10 rounded-md bg-white/10 animate-pulse" />
              <div className="h-6 w-10 rounded-md bg-white/10 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Title + creator — explicitly left aligned */}
            <div className="text-left">
              <h2 className="text-white font-semibold text-base leading-tight truncate">
                {meta.name}
              </h2>
              <p className="text-white/40 text-xs mt-0.5">by {meta.creator}</p>
            </div>

            {/* Description */}
            <p className="text-white/50 text-xs leading-relaxed line-clamp-2 text-left">
              {meta.description || "No description provided."}
            </p>

            {/* Stats */}
            <div className="flex gap-4 pt-1">
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{formatNum(meta.visits)}</span>
                <span className="text-white/40 text-xs">Visits</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">{formatNum(meta.playing)}</span>
                <span className="text-white/40 text-xs">Playing</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  {formatNum(meta.favoritedCount)}
                </span>
                <span className="text-white/40 text-xs">Favorites</span>
              </div>
            </div>

            {/* Link */}
            <a
              href={`https://www.roblox.com/games/${PlaceId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View on Roblox →
            </a>
          </>
        )}
      </div>
    </Glass>
  );
}
