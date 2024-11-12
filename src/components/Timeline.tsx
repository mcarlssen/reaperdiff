import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Timeline.css';

interface TimelineProps {
  controlClips: Clip[];
  revisedClips: Clip[];
  width: number;
  height: number;
}

interface Clip {
  POSITION: number;
  LENGTH: number;
  IGUID: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  controlClips,
  revisedClips,
  width,
  height
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    console.log('Timeline useEffect triggered with:', {
      controlClips,
      revisedClips,
      svgRef: svgRef.current
    });

    if (!svgRef.current || !controlClips.length) {
      console.log('Early return due to:', {
        svgRefExists: !!svgRef.current,
        controlClipsLength: controlClips.length
      });
      return;
    }

    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate the full time range
    const timeExtent = d3.extent([
      ...controlClips.map(c => c.POSITION),
      ...controlClips.map(c => c.POSITION + c.LENGTH),
      ...revisedClips.map(c => c.POSITION),
      ...revisedClips.map(c => c.POSITION + c.LENGTH)
    ]) as [number, number];

    // Create scales with margins
    const margin = { left: 0, right: 0 };
    const xScale = d3.scaleLinear()
      .domain(timeExtent)
      .range([margin.left, width - margin.right]);

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // Draw clips
    const drawClips = (clips: Clip[], yOffset: number, getColor: (clip: Clip) => string) => {
      svg.selectAll(`rect.clip-${yOffset}`)
        .data(clips)
        .enter()
        .append('rect')
        .attr('class', d => {
          const status = getClipColor(d, yOffset === 20);
          return `timeline-clip clip-${yOffset} ${status}`;
        })
        .attr('x', d => xScale(d.POSITION))
        .attr('y', yOffset)
        .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION))
        .attr('height', 40);
    };

    // Color determination function
    const getClipColor = (clip: Clip, isControl: boolean) => {
      const otherClips = isControl ? revisedClips : controlClips;
      const matchingClip = otherClips.find(c => c.IGUID === clip.IGUID);

      if (!matchingClip) return 'deleted-added';
      if (matchingClip.POSITION !== clip.POSITION) return 'modified';
      return 'unchanged';
    };

    // Draw both sets of clips
    drawClips(controlClips, 20, clip => getClipColor(clip, true));
    drawClips(revisedClips, 100, clip => getClipColor(clip, false));

    // Add labels
    svg.append('text')
      .attr('class', 'timeline-label')
      .attr('x', 10)
      .attr('y', 15)
      .text('Control');

    svg.append('text')
      .attr('class', 'timeline-label')
      .attr('x', 10)
      .attr('y', 95)
      .text('Revised');

    // Add time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString());

    svg.append('g')
      .attr('class', 'timeline-axis')
      .attr('transform', `translate(0, ${height - 40})`)
      .call(xAxis);

  }, [controlClips, revisedClips, width, height]);

  return (
    <svg 
      ref={svgRef}
      className="timeline-svg"
      style={{
        height: height,
        width: width
      }}
    />
  );
}; 