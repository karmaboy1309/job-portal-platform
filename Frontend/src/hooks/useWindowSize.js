import { useState, useEffect } from 'react';

/**
 * Custom hook that returns the current window dimensions.
 * Automatically updates on resize.
 *
 * @returns {{ width: number, height: number }}
 *
 * @example
 * const { width } = useWindowSize();
 * const isMobile = width < 768;
 */
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let rafId;

    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}

export default useWindowSize;
