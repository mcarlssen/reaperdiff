import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TimelineProps {
  controlClips: Clip[];
  revisedClips: Clip[];
  width?: number;
  height?: number;
}

interface Clip {
  POSITION: number;
  LENGTH: number;
  IGUID: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  controlClips,
  revisedClips,
  width = 1000,
  height = 100
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

    console.log('Time extent:', timeExtent);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(timeExtent)
      .range([50, width - 50]); // Add margins

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Draw clips
    const drawClips = (clips: Clip[], yOffset: number, getColor: (clip: Clip) => string) => {
      svg.selectAll(`rect.clip-${yOffset}`)
        .data(clips)
        .enter()
        .append('rect')
        .attr('class', `clip-${yOffset}`)
        .attr('x', d => xScale(d.POSITION))
        .attr('y', yOffset)
        .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION))
        .attr('height', 20)
        .attr('fill', getColor)
        .attr('rx', 3) // Rounded corners
        .attr('ry', 3);
    };

    // Color determination function
    const getClipColor = (clip: Clip, isControl: boolean) => {
      const otherClips = isControl ? revisedClips : controlClips;
      const matchingClip = otherClips.find(c => c.IGUID === clip.IGUID);

      if (!matchingClip) return '#ff4444'; // Red for deleted/added
      if (matchingClip.POSITION !== clip.POSITION) return '#ffaa00'; // Yellow for modified
      return '#44aa44'; // Green for unchanged
    };

    // Draw both sets of clips
    drawClips(controlClips, 20, clip => getClipColor(clip, true));
    drawClips(revisedClips, 60, clip => getClipColor(clip, false));

    // Add labels
    svg.append('text')
      .attr('x', 10)
      .attr('y', 35)
      .text('Control')
      .attr('fill', '#ddd');

    svg.append('text')
      .attr('x', 10)
      .attr('y', 75)
      .text('Revised')
      .attr('fill', '#ddd');

    // Add time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString());

    svg.append('g')
      .attr('transform', `translate(0, ${height - 20})`)
      .call(xAxis)
      .attr('color', '#ddd');

  }, [controlClips, revisedClips, width, height]);

  return (
    <svg 
      ref={svgRef} 
      style={{
        border: '1px solid red',
        backgroundColor: 'var(--secondary-bg)',
        width: width,
        height: height
      }}
    />
  );
}; 