export interface PromiseItem {
  title: string;
  description: string;
}

export const promises: PromiseItem[] = [
  {
    title: 'Modular',
    description: 'Small, single-purpose ModuleScripts with clear APIs, so features plug in and out without rewrites.',
  },
  {
    title: 'Organized',
    description: 'A clean folder structure, consistent naming and no mystery scripts hidden around the place.',
  },
  {
    title: 'Typed & readable',
    description: 'Strict-mode Luau with type annotations and comments where they matter. Your team can read it.',
  },
  {
    title: 'Optimized',
    description: 'Profiled with the MicroProfiler. No leaked connections, no wasted remotes, smooth on mobile.',
  },
  {
    title: 'Secure',
    description: 'Server-authoritative logic and validated remotes, so exploiters cannot hand themselves currency.',
  },
  {
    title: 'Clear communication',
    description: 'Regular progress updates, honest timelines and a support window after delivery.',
  },
];
