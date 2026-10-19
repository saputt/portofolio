import { FC, useEffect, useRef, useState, useCallback } from 'react';
import { projectsData } from '../../data/projectsData';

interface FlowArrowProps {}

export const FlowArrow: FC<FlowArrowProps> = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 64, height: 0 });
  const pathLengthRef = useRef(0);
  const samplesRef = useRef<[number, number][]>([]);
  const nodeYsRef = useRef<number[]>([]);

  // Determine foreground color based on project background
  const getFgColor = (index: number): string => {
    return projectsData[index]?.bg === 'blue' ? '#fff' : '#2563EB';
  };

  // Determine background color based on project background
  const getBgColor = (index: number): string => {
    const bg = projectsData[index]?.bg;
    if (bg === 'blue') return '#2563EB';
    if (bg === 'sky') return '#EFF6FF';
    return '#fff';
  };

  // Check if reduced motion is preferred
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Calculate dimensions
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.parentElement;
    if (!container) return;
    
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 32 : 64;
    const height = container.offsetHeight;
    
    setDimensions({ width, height });
  }, []);

  // Generate SVG path data
  const generatePathData = useCallback((height: number): { path: string; nodeYs: number[] } => {
    const isMobile = window.innerWidth < 768;
    const cx = isMobile ? 16 : 30;
    const n = projectsData.length;
    const sw = isMobile ? 7 : 10;
    const sh = height / n;
    
    // Calculate node Y positions (center of each project slide)
    const nodeYs = projectsData.map((_, i) => sh * (i + 0.5));
    
    // Build Bezier curve path
    let y = sh * 0.05;
    let path = `M${cx} ${y}`;
    
    nodeYs.forEach((ny) => {
      const o = (nodeYs.indexOf(ny) % 2 === 1) ? sw : -sw;
      path += ` C${cx + o} ${y + (ny - y) * 0.35} ${cx - o} ${y + (ny - y) * 0.7} ${cx} ${ny}`;
      y = ny;
    });
    
    // End path near bottom
    path += ` C${cx + sw} ${y + (height - y) * 0.3} ${cx - sw} ${y + (height - y) * 0.6} ${cx} ${height - sh * 0.06}`;
    
    return { path, nodeYs };
  }, []);

  // Generate gradient stops
  const generateGradientStops = useCallback((): string => {
    const n = projectsData.length;
    return projectsData.map((_, i) => {
      const offsetStart = i / n + 0.01;
      const offsetEnd = (i + 1) / n - 0.01;
      const color = getFgColor(i);
      return `<stop offset="${offsetStart}" stop-color="${color}"/><stop offset="${offsetEnd}" stop-color="${color}"/>`;
    }).join('');
  }, []);

  // Build or rebuild the SVG
  const buildFlow = useCallback(() => {
    if (!svgRef.current || dimensions.height === 0) return;
    
    const { width, height } = dimensions;
    const isMobile = window.innerWidth < 768;
    const cx = isMobile ? 16 : 30;
    const { path, nodeYs } = generatePathData(height);
    
    // Store nodeYs for updateFlow
    nodeYsRef.current = nodeYs;
    
    // Generate gradient stops
    const gradientStops = generateGradientStops();
    
    // Build SVG content
    const svgContent = `
      <defs>
        <linearGradient id="fg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${height}">
          ${gradientStops}
        </linearGradient>
      </defs>
      <path id="tr" d="${path}" fill="none" stroke="url(#fg)" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 9" opacity=".55"/>
      <path id="pr" d="${path}" fill="none" stroke="url(#fg)" stroke-width="2.5" stroke-linecap="round"/>
      ${nodeYs.map((yy, i) => `
        <circle class="nd" cx="${cx}" cy="${yy}" r="7" stroke="${getFgColor(i)}" stroke-width="2.5" fill="${getBgColor(i)}"/>
        ${!isMobile ? `<text x="${cx + 17}" y="${yy + 4}" fill="${getFgColor(i)}" style="font: 700 13px 'Plus Jakarta Sans', system-ui, sans-serif;">${projectsData[i].title}</text>` : ''}
      `).join('')}
      <g id="tip">
        <path d="M-8 -10 L0 0 L8 -10" fill="none" stroke="url(#fg)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;
    
    svgRef.current.innerHTML = svgContent;
    svgRef.current.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Get path length for animation
    const progressPath = svgRef.current.querySelector('#pr') as SVGPathElement;
    if (progressPath) {
      const pathLength = progressPath.getTotalLength();
      pathLengthRef.current = pathLength;
      progressPath.style.strokeDasharray = `0 ${pathLength}`;
      
      // Sample points along the path for efficient scroll calculations
      samplesRef.current = Array.from({ length: 241 }, (_, k) => {
        const l = (pathLength * k) / 240;
        return [l, progressPath.getPointAtLength(l).y];
      });
    }
  }, [dimensions, generatePathData, generateGradientStops]);

  // Update animation based on scroll
  const updateFlow = useCallback(() => {
    if (!svgRef.current || pathLengthRef.current === 0) return;
    
    const container = containerRef.current?.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress based on container position
    const scrollPosition = viewportHeight / 2 - rect.top;
    
    // Find the appropriate length based on scroll position
    const targetY = Math.min(Math.max(scrollPosition, samplesRef.current[0][1]), samplesRef.current[240][1]);
    
    let k = samplesRef.current.findIndex(q => q[1] >= targetY);
    if (k < 0) k = 240;
    
    // Interpolate to get precise length
    let len = 0;
    if (k > 0) {
      const [prevL, prevY] = samplesRef.current[k - 1];
      const [nextL, nextY] = samplesRef.current[k];
      const ratio = (targetY - prevY) / ((nextY - prevY) || 1);
      len = prevL + (nextL - prevL) * ratio;
    }
    
    const pathLength = pathLengthRef.current;
    
    // Update progress path stroke-dasharray
    const progressPath = svgRef.current.querySelector('#pr') as SVGPathElement;
    if (progressPath) {
      progressPath.style.strokeDasharray = `${len} ${pathLength}`;
    }
    
    // Update arrow tip position and rotation
    const tipEl = svgRef.current.querySelector('#tip') as SVGGElement;
    if (tipEl && progressPath) {
      const point = progressPath.getPointAtLength(len);
      const nextPoint = progressPath.getPointAtLength(Math.min(pathLength, len + 3));
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI) - 90;
      tipEl.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
    }
    
    // Update node fills based on scroll position
    const nodeEls = svgRef.current.querySelectorAll('.nd');
    nodeEls.forEach((circle, i) => {
      if (circle instanceof SVGCircleElement) {
        const fill = targetY >= nodeYsRef.current[i] - 2 ? getFgColor(i) : getBgColor(i);
        circle.setAttribute('fill', fill);
      }
    });
  }, []);

  // Initialize dimensions and build flow
  useEffect(() => {
    updateDimensions();
    
    const handleResize = () => {
      updateDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateDimensions]);

  // Rebuild when dimensions change
  useEffect(() => {
    if (dimensions.height > 0) {
      buildFlow();
    }
  }, [dimensions, buildFlow]);

  // Handle scroll animation - FIXED: proper cleanup for both listeners
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateFlow();
          ticking = false;
        });
      }
    };
    
    // Add both listeners, clean up both on unmount
    const snapContainer = document.getElementById('snap');
    snapContainer?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      snapContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateFlow, prefersReducedMotion]);

  const { width, height } = dimensions;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        ref={svgRef}
        id="flow"
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      />
    </div>
  );
};