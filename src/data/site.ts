/**
 * Site-wide copy and settings. Edit text here; components only read it.
 * Every value in [BRACKETS] is a placeholder you should replace.
 */
export const site = {
  brand: 'Nxen',
  /** Logo icon (white on transparent) shown in the nav badge. Favicon: public/favicon.ico */
  icon: '/nxen-icon.png',
  discord: 'nxen',
  meta: {
    title: 'Nxen',
    description: 'My portfolio.',
    ogImage: '/og-image.png',
    locale: 'en_US',
  },
  hero: {
    titleLead: 'Roblox',
    titleAccent: 'Scripter',
    subline:
      'I script top-quality frameworks for Roblox games, focusing on good quality, structure and performance.',
    primaryCta: { label: 'Hire me', href: '#contact' },
    secondaryCta: { label: 'Explore games', href: '#games' },
    scrollHint: 'Scroll to explore',
  },
  /** Labels used by the HUD "map" and the zone headings. */
  zones: {
    hero: 'Spawn',
    games: 'Games',
    promises: 'Promises',
    contact: 'Contact',
  },
  games: {
    /** Stat labels under each game (numbers come from Roblox). */
    visits: 'Visits',
    likes: 'Likes',
    favorites: 'Favorites',
  },
  promises: {
    title: 'Top-Tier Code',
  },
  contact: {
    title: 'Let’s work together',
    body: 'I am available most of the time and will reply within 24h.',
    discordLabel: 'Copy Discord',
    discordCopied: 'Copied to clipboard',
  },
  footer: {
    note: 'Not affiliated with or endorsed by Roblox Corporation.',
  },
  notFound: {
    title: 'You fell out of the map.',
    body: 'The page you are looking for does not exist, or it was moved.',
    cta: 'Respawn',
  },
} as const;
