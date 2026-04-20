/**
 * Utility to lock/unlock the body scroll when modals or drawers are open.
 * Uses `position: fixed` with scroll-position preservation — the most reliable
 * cross-browser/iOS approach.
 */

let scrollX = 0;
let scrollY = 0;
let lockCount = 0;
let previousBodyStyles = null;

function restoreNativeScroll(x, y) {
  const html = document.documentElement;
  const previousScrollBehavior = html.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  try {
    window.scrollTo({ left: x, top: y, behavior: 'instant' });
  } catch {
    window.scrollTo(x, y);
  }
  html.style.scrollBehavior = previousScrollBehavior;
}

function restoreScrollPosition(x, y) {
  const lenis = window.__mrijaLenis;

  if (lenis?.scrollTo) {
    lenis.scrollTo(y, { immediate: true, force: true });
    lenis.resize?.();
    return;
  }

  restoreNativeScroll(x, y);
}

export function lockBodyScroll() {
  lockCount++;
  if (lockCount > 1) return; // already locked

  scrollX = window.scrollX;
  scrollY = window.scrollY;
  previousBodyStyles = {
    position: document.body.style.position,
    top: document.body.style.top,
    left: document.body.style.left,
    right: document.body.style.right,
    width: document.body.style.width,
    overflowY: document.body.style.overflowY,
    paddingRight: document.body.style.paddingRight,
  };

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const currentPaddingRight = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

  window.__mrijaLenis?.stop?.();
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = `-${scrollX}px`;
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflowY = 'hidden';

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
  }
}

export function unlockBodyScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0) return; // still locked by another modal

  const targetX = scrollX;
  const targetY = scrollY;

  if (previousBodyStyles) {
    document.body.style.position = previousBodyStyles.position;
    document.body.style.top = previousBodyStyles.top;
    document.body.style.left = previousBodyStyles.left;
    document.body.style.right = previousBodyStyles.right;
    document.body.style.width = previousBodyStyles.width;
    document.body.style.overflowY = previousBodyStyles.overflowY;
    document.body.style.paddingRight = previousBodyStyles.paddingRight;
  } else {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';
  }

  previousBodyStyles = null;
  restoreScrollPosition(targetX, targetY);
  window.__mrijaLenis?.start?.();
}
