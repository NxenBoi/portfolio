/**
 * Single source of truth for navigation (nav bar + footer).
 * Every item is an in-page anchor for now. When you add a real page later
 * (e.g. src/pages/games.astro), change its href to '/games'.
 */
export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: 'Games', href: '/#games' },
  { label: 'Promises', href: '/#promises' },
  { label: 'Contact', href: '/#contact' },
];
