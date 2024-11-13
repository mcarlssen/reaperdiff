import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Timeline.css';
import { Clip, Change } from '../types';

interface TimelineProps {
  controlClips: Clip[];
  revisedClips: Clip[];
  width: number;
  height: number;
  changes: Change[];
}

export const Timeline: React.FC<TimelineProps> = ({
  controlClips,
  revisedClips,
  width,
  height,
  changes
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    console.log('Timeline useEffect triggered with:', {
      controlClips,
      revisedClips,
      changes,
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

    // Updated color determination function
    const getClipColor = (clip: Clip, isControl: boolean): string => {
      const change = changes.find(c => {
        if (isControl) {
          return c.originalPosition === clip.POSITION;
        } else {
          return c.position === clip.POSITION;
        }
      });

      if (!change) return 'unchanged';

      switch (change.type) {
        case 'deleted':
          return isControl ? 'deleted-added' : 'unchanged';
        case 'added':
          return isControl ? 'unchanged' : 'deleted-added';
        case 'changed':
          return 'modified';
        default:
          return 'unchanged';
      }
    };

    // Updated drawClips function
    const drawClips = (clips: Clip[], yOffset: number, isControl: boolean) => {
      const clipGroup = svg.append('g')
        .attr('class', `clips-${isControl ? 'control' : 'revised'}`);

      clipGroup.selectAll('rect')
        .data(clips)
        .enter()
        .append('rect')
        .attr('class', d => {
          const status = getClipColor(d, isControl);
          return `timeline-clip ${status}`;
        })
        .attr('x', d => xScale(d.POSITION))
        .attr('y', yOffset)
        .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION))
        .attr('height', 40)
        // Add tooltips
        .append('title')
        .text(d => {
          const change = changes.find(c => 
            isControl ? c.originalPosition === d.POSITION : c.position === d.POSITION
          );
          return `Position: ${d.POSITION.toFixed(3)}
Length: ${d.LENGTH.toFixed(3)}
Status: ${change ? change.type : 'unchanged'}`;
        });
    };

    // Draw clips with updated functions
    drawClips(controlClips, 20, true);
    drawClips(revisedClips, 100, false);

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

  }, [controlClips, revisedClips, changes, width, height]);

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