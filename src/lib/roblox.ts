/**
 * BUILD-TIME ONLY. Fetches game info from Roblox's public APIs while Astro
 * builds the site, so the deployed page stays fully static (no backend, no
 * API calls from visitors' browsers).
 *
 * Thumbnails are downloaded and re-encoded by Astro's image pipeline, so they
 * are served from your own domain (Roblox CDN links expire after ~180 days).
 *
 * If Roblox is unreachable during a build, the build still succeeds: cards
 * fall back to the link, a placeholder screen, and hidden stats.
 */
import { getImage } from 'astro:assets';
import type { GameEntry } from '../data/games';

export interface GameCard {
  url: string;
  title: string;
  description: string;
  /** Self-hosted thumbnail URL, or '' for the placeholder screen. */
  image: string;
  visits: number | null;
  likes: number | null;
  favorites: number | null;
}

const TIMEOUT = 10_000;
const MAX_LINES = 4;
const MAX_CHARS = 260;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

const placeIdOf = (url: string) => /roblox\.com\/games\/(\d+)/.exec(url)?.[1] ?? '';

/** "[UPDATE 1] +1 Swim Speed Every Step" → "+1 Swim Speed Every Step" */
export function cleanTitle(name: string): string {
  const cleaned = name.replace(/^\s*(?:[[(【][^\])】]*[\])】]\s*)+/u, '').trim();
  return cleaned || name.trim();
}

/** First few non-empty lines of the Roblox description, capped in length. */
export function shortDescription(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, MAX_LINES);
  let out = lines.join('\n');
  if (out.length > MAX_CHARS) out = `${out.slice(0, MAX_CHARS).replace(/\s+\S*$/u, '')}…`;
  return out;
}

let cache: Promise<GameCard[]> | null = null;

export function loadGames(entries: GameEntry[]): Promise<GameCard[]> {
  cache ??= fetchGames(entries);
  return cache;
}

async function fetchGames(entries: GameEntry[]): Promise<GameCard[]> {
  const fallback = (e: GameEntry): GameCard => ({
    url: e.url,
    title: e.title ?? 'Roblox game',
    description: e.description ?? '',
    image: '',
    visits: null,
    likes: null,
    favorites: null,
  });

  try {
    // 1) place id (from the link) → universe id
    const universeIds = await Promise.all(
      entries.map(async (e) => {
        const placeId = placeIdOf(e.url);
        if (!placeId) return null;
        try {
          const r = await getJson<{ universeId: number | null }>(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
          return r.universeId;
        } catch {
          return null;
        }
      }),
    );
    const ids = universeIds.filter((id): id is number => typeof id === 'number');
    if (!ids.length) return entries.map(fallback);
    const list = ids.join(',');

    // 2) details, votes and thumbnails in three batched requests
    const [details, votes, thumbs] = await Promise.all([
      getJson<{ data: Array<{ id: number; name: string; description: string | null; visits: number; favoritedCount: number }> }>(
        `https://games.roblox.com/v1/games?universeIds=${list}`,
      ),
      getJson<{ data: Array<{ id: number; upVotes: number }> }>(`https://games.roblox.com/v1/games/votes?universeIds=${list}`).catch(
        () => ({ data: [] }),
      ),
      getJson<{ data: Array<{ universeId: number; thumbnails: Array<{ state: string; imageUrl: string | null }> }> }>(
        `https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${list}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`,
      ).catch(() => ({ data: [] })),
    ]);

    return await Promise.all(
      entries.map(async (entry, i) => {
        const id = universeIds[i];
        const d = details.data.find((g) => g.id === id);
        if (!id || !d) return fallback(entry);
        const v = votes.data.find((g) => g.id === id);
        const remote = thumbs.data.find((t) => t.universeId === id)?.thumbnails.find((t) => t.state === 'Completed')?.imageUrl;

        let image = '';
        if (remote) {
          try {
            const img = await getImage({ src: remote, inferSize: true, format: 'webp', quality: 85 });
            image = img.src;
          } catch (err) {
            console.warn(`[roblox] thumbnail download failed for ${entry.url}:`, err);
          }
        }

        return {
          url: entry.url,
          title: entry.title ?? cleanTitle(d.name),
          description: entry.description ?? shortDescription(d.description ?? ''),
          image,
          visits: d.visits,
          likes: v?.upVotes ?? null,
          favorites: d.favoritedCount,
        };
      }),
    );
  } catch (err) {
    console.warn('[roblox] could not reach the Roblox API; using fallbacks.', err);
    return entries.map(fallback);
  }
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
export const formatCount = (n: number | null) => (n === null ? '–' : compact.format(n));
