/** Copies the Discord handle and announces it via a live region. Runs once. */
export function initCopy(): void {
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  document.querySelectorAll<HTMLElement>('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy ?? '';
      try {
        await navigator.clipboard.writeText(text);
        if (status) status.textContent = `${status.dataset.copiedText ?? 'Copied'}: ${text}`;
      } catch {
        if (status) status.textContent = text;
      }
    });
  });
}
