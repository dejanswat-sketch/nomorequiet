'use client';

import React from 'react';
import type { NodeData, NodeId } from './MapOfLightsClient';

interface MapSidebarProps {
  nodes: NodeData[];
  selectedNode: NodeData | null;
  onSelectNode: (node: NodeData | null) => void;
  filterNode: NodeId | 'all';
  onFilterChange: (id: NodeId | 'all') => void;
}

export default function MapSidebar({
  nodes,
  selectedNode,
  onSelectNode,
  filterNode,
  onFilterChange,
}: MapSidebarProps) {
  return (
    <div className="w-72 xl:w-80 flex flex-col border-r border-amber/10 bg-deep-earth/30 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-amber/10">
        <p className="nmq-label mb-1" style={{ fontSize: '0.55rem', color: '#c8822a' }}>
          THE GLOBAL NEXUS
        </p>
        <p className="nmq-heading text-xl italic text-gold">Map of Lights</p>
        <p className="font-cormorant italic text-mist text-sm mt-1">
          Seven nodes. One House.
        </p>
      </div>

      {/* Filter */}
      <div className="px-5 py-3 border-b border-amber/8">
        <p className="nmq-label mb-2" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
          FILTER BY NODE
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            className={`px-2.5 py-1 nmq-label transition-all duration-200 ${
              filterNode === 'all' ?'bg-amber/15 text-amber border border-amber/40' :'border border-silence/40 text-silence hover:text-mist hover:border-amber/30'
            }`}
            style={{ fontSize: '0.45rem' }}
            onClick={() => onFilterChange('all')}
          >
            ALL
          </button>
          {nodes.map((node) => (
            <button
              key={`filter-${node.id}`}
              className={`px-2.5 py-1 nmq-label transition-all duration-200 ${
                filterNode === node.id
                  ? 'bg-amber/15 text-amber border border-amber/40' :'border border-silence/40 text-silence hover:text-mist hover:border-amber/30'
              }`}
              style={{ fontSize: '0.45rem' }}
              onClick={() => onFilterChange(node.id)}
            >
              {node.name.replace(/^Mount\s+/i, '').toUpperCase().split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto">
        {nodes.map((node) => (
          <button
            key={`sidebar-node-${node.id}`}
            className={`w-full text-left px-5 py-4 border-b border-amber/6 transition-all duration-200 group ${
              selectedNode?.id === node.id
                ? 'bg-amber/8 border-l-2 border-l-amber' :'hover:bg-amber/4'
            }`}
            onClick={() => onSelectNode(selectedNode?.id === node.id ? null : node)}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: node.isCenter ? '7px' : '5px',
                    height: node.isCenter ? '7px' : '5px',
                    borderRadius: '50%',
                    background: node.isCenter ? '#D4AF37' : '#c8822a',
                    boxShadow: node.isCenter
                      ? '0 0 10px rgba(212,175,55,0.9)'
                      : '0 0 6px rgba(200,130,42,0.7)',
                    animation: 'pulseAmber 3s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="font-cormorant font-light text-cream text-sm group-hover:text-amber transition-colors">
                    {node.name}
                  </p>
                  <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a' }}>
                    {node.label}
                  </p>
                </div>
              </div>
            </div>
            <p className="font-cormorant italic text-mist text-xs leading-relaxed">
              {node.metaphor}
            </p>
            <p className="nmq-label mt-1.5" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
              {node.coords}
            </p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-amber/10">
        <p className="font-cormorant italic text-silence text-xs">
          All paths lead to Rtanj.
        </p>
        <p className="nmq-label mt-3" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
          A light is a sentence, not a score
        </p>
      </div>
    </div>
  );
}