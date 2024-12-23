import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './Timeline.css';
import { Clip, Change } from '../types';
import { generateTooltip } from './helpers/generateTooltip'
import { TOLERANCE } from '../constants'
import { changeIcons } from '../constants/icons'
import { createRoot } from 'react-dom/client'
import { FileCsv, Siren } from "@phosphor-icons/react"
import { toast } from 'react-hot-toast'
import { sendEmail } from './helpers/sendEmail'
import { ConfirmationModal } from './ConfirmationModal'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback'
import Button from '@mui/material/Button'

interface TimelineProps {
  revisedClips: Clip[];
  width: number;
  height: number;
  changes: Change[];
  hoveredPosition: number | null;
  overlappingClips: number[];
  onHover?: (position: number | null) => void;
  showTooltip?: boolean;
  onDownloadCSV: (changes: Change[], filename: string) => void;
  revisedFileName?: string;
  controlClips: Clip[];
}

const legendItems = Object.values(changeIcons)

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
  controlClips,
  width,
  height,
  changes,
  hoveredPosition,
  overlappingClips,
  onHover,
  showTooltip,
  onDownloadCSV,
  revisedFileName
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Main effect for initial render
  useEffect(() => { 
    /*
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
    */

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
        const isHovered = hoveredPosition === d.POSITION
        return `timeline-clip ${status}${isOffset ? ' offset' : ''}${isHovered ? ' hovered' : ''}`
      })
      .attr('x', (d, i) => xScale(d.POSITION) + i * clipSpacing)
      .attr('y', d => yOffset + getClipYOffset(d))
      .attr('width', d => xScale(d.POSITION + d.LENGTH) - xScale(d.POSITION) - clipSpacing)
      .attr('height', clipHeight)
      .call(selection => {
        if (showTooltip !== false) {  // Default to showing if not explicitly disabled
          selection.append('title')
            .text(d => generateTooltip(d, changes))
        }
      })

    clipGroup.selectAll('rect')
      .on('mouseenter.timeline', function(event, d: any) {
        event.stopPropagation()
        const position = d.POSITION
        /*
        console.log('Timeline clip hover enter:', {
          position,
          clipData: d
        })
        */
        onHover?.(position)
      })
      .on('mouseleave.timeline', function(event) {
        event.stopPropagation()
        //console.log('Timeline clip hover leave')
        onHover?.(null)
      })

    // Add time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d => d.toString());

    svg.append('g')
      .attr('class', 'timeline-axis')
      .attr('transform', `translate(0, ${height - 30})`)
      .call(xAxis);
  }, [revisedClips, changes, width, height]);

  // Separate effect for hover state updates
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    
    svg.selectAll('.clips-revised .timeline-clip')
      .each(function(d: any) {
        const clip = d3.select(this)
        const status = getClipColor(d, changes)
        const isOffset = overlappingClips?.includes(d.POSITION)
        const isHovered = hoveredPosition === d.POSITION
        
        /*
        console.log('Updating clip class on hover:', {
          position: d.POSITION,
          isHovered,
          hoveredPosition
        })
        */      
        clip.attr('class', `timeline-clip ${status}${isOffset ? ' offset' : ''}${isHovered ? ' hovered' : ''}`)
      })
  }, [hoveredPosition, changes, overlappingClips]);

  const handleAnalysisRequest = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Sending dataset for analysis...')

      // Validate data before sending
      if (!controlClips?.length || !revisedClips?.length) {
        toast.dismiss(loadingToast)
        toast.error('Missing timeline data')
        return
      }

      const result = await sendEmail({
        controlData: JSON.stringify(controlClips),
        revisedData: JSON.stringify(revisedClips),
        timestamp: new Date().toISOString()
      })

      if (result.success) {
        toast.success('Dataset sent for analysis') // This should show the success toast
        toast.dismiss(loadingToast)
        setShowConfirmModal(false)
      } else {
        toast.dismiss(loadingToast)
        toast.error(result.error || 'Failed to send dataset')
      }
    } catch (error) {
      console.error('Analysis request error:', error)
      toast.error('Failed to process request')
    }
  }

  // Add debug logging when props change
  useEffect(() => {
    /*
    console.log('Timeline props updated:', {
      hasControlClips: Boolean(controlClips),
      hasRevisedClips: Boolean(revisedClips),
      controlLength: controlClips?.length,
      revisedLength: revisedClips?.length
    })
    */
  }, [controlClips, revisedClips])

  useEffect(() => {
    if (showConfirmModal) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowConfirmModal(false)
      }
      
      window.addEventListener('keydown', handleEscape)
      
      return () => {
        // Cleanup
        document.body.style.overflow = 'unset'
        window.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showConfirmModal])

  return (
    <div className="timeline-wrapper" style={{ width: '100%' }}>
      <div className="timeline-header">
        <div className="timeline-label">
          <span className="timeline-label-text">Revised project timeline</span>
          <FileCsv 
            size={28}
            className="csv-download-icon"
            onClick={() => onDownloadCSV(changes, revisedFileName || 'results')}
            aria-label="Download CSV"
          />
          <Siren 
            size={28}
            className="send-for-analysis-icon"
            onClick={() => setShowConfirmModal(true)}
            aria-label="Send for analysis"
          />
        </div>
        <div className="timeline-legend">
          {Object.entries(changeIcons).map(([key, item]) => {
            const IconComponent = item.icon
            return (
              <div key={key} className="legend-item">
                <div 
                  className={`legend-color ${item.class}`}
                  style={{ backgroundColor: item.color }}
                >
                  <IconComponent 
                    size={20}
                    weight="fill"
                    color="var(--primary-bg)"
                    aria-label={item.alt}
                  />
                </div>
                <span className="legend-text">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <ConfirmationModal
        open={showConfirmModal}
        onConfirm={handleAnalysisRequest}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div className="timeline-svg-container">
        <svg 
          ref={svgRef}
          className="timeline-svg bordered"
          style={{
            height: height,
            width: width,
            transition: 'width 0.5s ease-out'
          }}
        />
      </div>
    </div>
  );
};  