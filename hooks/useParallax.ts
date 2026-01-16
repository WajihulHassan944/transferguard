import { useState, useEffect, useCallback } from 'react';

interface ParallaxValues {
  scrollY: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
}

export function useParallax() {
  const [values, setValues] = useState<ParallaxValues>({
    scrollY: 0,
    scrollProgress: 0,
    mouseX: 0,
    mouseY: 0,
  });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? scrollY / docHeight : 0;
    
    setValues(prev => ({
      ...prev,
      scrollY,
      scrollProgress,
    }));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
    
    setValues(prev => ({
      ...prev,
      mouseX,
      mouseY,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleScroll, handleMouseMove]);

  return values;
}

export function useScrollProgress(elementRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: Array.from({ length: 100 }, (_, i) => i / 100) }
    );

    observer.observe(element);

    const handleScroll = () => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementHeight = rect.height;
      
      // Progress from 0 (element entering) to 1 (element leaving)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));
      
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [elementRef]);

  return { progress, isVisible };
}
