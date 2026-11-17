/**
 * Reads colour tokens from tokens.css so the 3D world never hardcodes a
 * colour. Change the CSS variables and the world follows.
 */
import { Color } from 'three';

export type ZoneKey = 'hero' | 'games' | 'promises' | 'contact';

export interface SkyColors {
  top: Color;
  horizon: Color;
  bottom: Color;
}

export interface WorldPalette {
  pink: Color;
  blue: Color;
  lilac: Color;
  aqua: Color;
  mint: Color;
  grass: Color;
  white: Color;
  ink: Color;
  sky: Record<ZoneKey, SkyColors>;
}

export function readPalette(): WorldPalette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string) => {
    const value = css.getPropertyValue(name).trim();
    const color = new Color();
    if (value) color.setStyle(value);
    return color;
  };
  const sky = (z: ZoneKey): SkyColors => ({
    top: get(`--sky-${z}-top`),
    horizon: get(`--sky-${z}-horizon`),
    bottom: get(`--sky-${z}-bottom`),
  });
  return {
    pink: get('--c-pink'),
    blue: get('--c-blue'),
    lilac: get('--c-lilac'),
    aqua: get('--c-aqua'),
    mint: get('--c-mint'),
    grass: get('--c-grass'),
    white: get('--c-white'),
    ink: get('--c-ink'),
    sky: { hero: sky('hero'), games: sky('games'), promises: sky('promises'), contact: sky('contact') },
  };
}

/** Reads a CSS font family token (for text drawn onto canvas textures). */
export function readFont(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'sans-serif';
}
