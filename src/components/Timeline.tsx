import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Timeline.css';
import { Clip, Change } from '../types';
import { generateTooltip } from './helpers/generateTooltip'
import { TOLERANCE } from '../constants'

interface TimelineProps {
  revisedClips: Clip[];
  width: number;
  height: number;
  changes: Change[];
  hoveredPosition: number | null;
}

export const Timeline: React.FC<TimelineProps> = ({
  revisedClips,
  width,
  height,
  changes,
  hoveredPosition
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    console.log('Timeline received clips:', {
      total: revisedClips.length,
      deleted: revisedClips.filter(clip => clip.isDeleted).length,
      changes
    });

    console.log('Timeline useEffect triggered with:', {
      revisedClips,
      changes,
      svgRef: svgRef.current
    });

    if (!svgRef.current || !revisedClips.length) {
      console.log('Early return due to:', {
        svgRefExists: !!svgRef.current,
        revisedClipsLength: revisedClips.length
      });
      return;
    }

    // Clear any existing visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate the time range for revised clips only
    const timeExtent = d3.extent([
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
    const getClipColor = (clip: Clip): string => {
        console.log('Processing clip color:', {
        clip,
            isDeleted: clip.isDeleted,
            matchingChange: changes.find(c => Math.abs(c.revisedPosition - clip.POSITION) < TOLERANCE)
        });

        // Check for deleted clips first
      if (clip.isDeleted) return 'deleted'
      
      const change = changes.find(c => Math.abs(c.revisedPosition - clip.POSITION) < TOLERANCE)
      if (!change) return 'unchanged'
      
      return change.type === 'added' ? 'added' : 
             change.type === 'changed' ? 'modified' : 
             change.type === 'deleted' ? 'deleted' : 'unchanged'
    }

    // Draw clips in the center of the available space
    const clipHeight = 200; // Increased height for better visibility
    const yOffset = (height - clipHeight) / 2.5; // Center vertically

    const clipSpacing = 1 // 1px spacing between clips

    const clipGroup = svg.append('g')
      .attr('class', 'clips-revised');

    clipGroup.selectAll('rect')
      .data(revisedClips)
      .enter()
      .append('rect')
      .attr('class', d => {
        const status = getClipColor(d)
        return `timeline-clip ${status}`
      })
      .attr('x', (d, i) => xScale(d.POSITION) + i * clipSpacing)
      .attr('y', yOffset)
      .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION) - clipSpacing)
      .attr('height', clipHeight)
      .append('title')
      .text(d => generateTooltip(d, changes))

    // Add "Revised" label
    svg.append('text')
      .attr('class', 'timeline-label')
      .attr('x', 0)
      .attr('y', yOffset - 20)
      .text('Revised project timeline');

    // Add time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString());

    svg.append('g')
      .attr('class', 'timeline-axis')
      .attr('transform', `translate(0, ${height - 50})`)
      .call(xAxis);

  }, [revisedClips, changes, width, height]);

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