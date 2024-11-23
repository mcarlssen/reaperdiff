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
  overlappingClips: number[];
}

const legendItems = [
  { label: 'Added', class: 'added' },
  { label: 'Deleted', class: 'deleted' },
  { label: 'Modified', class: 'modified' },
  { label: 'Static', class: 'unchanged' },
  { label: 'Silence', class: 'silence' }
]

const getClipColor = (clip: Clip, changes: Change[]): string => {
  const change = changes.find((c: Change) => Math.abs(c.revisedPosition - clip.POSITION) < TOLERANCE)

  // Check for deleted clips first
  if (clip.isDeleted) return 'deleted'
  
  if (!change) return 'unchanged'
  
  if (change.detectionMethod === 'silence') return 'silence'
  
  return change.type === 'added' ? 'added' : 
         change.type === 'changed' ? 'modified' : 
         change.type === 'deleted' ? 'deleted' : 'unchanged'
}

export const Timeline: React.FC<TimelineProps> = ({
  revisedClips,
  width,
  height,
  changes,
  hoveredPosition,
  overlappingClips
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

    // Draw clips in the center of the available space
    const clipHeight = 200; // Increased height for better visibility
    const yOffset = ((height - clipHeight) / 2.5) + 10; // Add 20px padding by shifting clips down

    const clipSpacing = 1 // 1px spacing between clips

    // Before creating the clipGroup, sort the clips
    const sortedClips = [...revisedClips]

    const clipGroup = svg.append('g')
      .attr('class', 'clips-revised');

    const getClipYOffset = (clip: Clip): number => {
      const offset = overlappingClips?.includes(clip.POSITION) ? 20 : 0 // Increased offset for visibility
      /* console.log('Clip offset calculation:', {
        position: clip.POSITION,
        isOverlapping: overlappingClips?.includes(clip.POSITION),
        offset
      }) */
      return offset
    }

    clipGroup.selectAll('rect')
      .data(sortedClips)
      .enter()
      .append('rect')
      .attr('class', d => {
        const status = getClipColor(d, changes)
        const isOffset = overlappingClips?.includes(d.POSITION)
        return `timeline-clip ${status}${isOffset ? ' offset' : ''}`
      })
      .attr('x', (d, i) => xScale(d.POSITION) + i * clipSpacing)
      .attr('y', d => yOffset + getClipYOffset(d))
      .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION) - clipSpacing)
      .attr('height', clipHeight)
      .append('title')
      .text(d => generateTooltip(d, changes))

    // Add header group with label and legend
    const headerGroup = svg.append('g')
      .attr('class', 'timeline-header')
      .attr('transform', `translate(0, ${yOffset - 40})`) // controls both the label and legend

    // Add "Revised" label
    headerGroup.append('text')
      .attr('class', 'timeline-label')
      .attr('x', 10)
      .text('Revised project timeline')

    // Add legend group
    const legend = headerGroup.append('g')
      .attr('class', 'timeline-legend')
      .attr('transform', `translate(${width - 360}, -25)`) // controls the legend position

    // Add legend border
    legend.append('rect')
      .attr('class', 'legend-border')
      .attr('width', 360)
      .attr('height', 30)
      .attr('rx', 4)

    // Add legend items
    const legendItem = legend.selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(${10 + i * 70}, 7)`)

    legendItem.append('rect')
      .attr('class', d => `timeline-clip ${d.class}`)
      .attr('width', 15)
      .attr('height', 15)
      .attr('rx', 2)

    legendItem.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('class', 'legend-text')
      .text(d => d.label)

    // Add time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString());

    svg.append('g')
      .attr('class', 'timeline-axis')
      .attr('transform', `translate(0, ${height - 30})`)
      .call(xAxis);

  }, [revisedClips, changes, width, height]);

  return (
    <div className="timeline-wrapper" style={{ width: '100%' }}>
      <svg 
        ref={svgRef}
        className="timeline-svg"
        style={{
          height: height,
          width: width,
          transition: 'width 0.5s ease-out' // Match container transition
        }}
      />
    </div>
  );
}; 