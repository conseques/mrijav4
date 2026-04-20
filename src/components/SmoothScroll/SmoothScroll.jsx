import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * SmoothScroll component wraps the application and provides
 * a "light" inertial scrolling experience using Lenis.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis with a "light" and smooth feel
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: false,
      wheelMultiplier: 1,
      syncTouch: false,
      touchMultiplier: 1,
      infinite: false,
    });
    window.__mrijaLenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const getAnchorTarget = (hash) => {
      if (!hash || hash.length <= 1) return null;

      const rawId = hash.slice(1);
      let decodedId = rawId;
      try {
        decodedId = decodeURIComponent(rawId);
      } catch {
        decodedId = rawId;
      }

      const target = document.getElementById(decodedId);
      if (target) return target;

      try {
        return document.querySelector(hash);
      } catch {
        return null;
      }
    };

    // Update ScrollTo behavior for smooth anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href]');
      if (!target) return;

      const url = new URL(target.href);
      const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
      if (!isSamePage) return;

      const element = getAnchorTarget(url.hash);
      if (element) {
        e.preventDefault();
        lenis.scrollTo(element, { offset: -80 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      if (window.__mrijaLenis === lenis) {
        delete window.__mrijaLenis;
      }
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
