'use client';

import React, { useState } from 'react';
import type { NodeData, LightData, NodeId } from './MapOfLightsClient';

interface MapCanvasProps {
  nodes: NodeData[];
  lights: LightData[];
  selectedNode: NodeData | null;
  hoveredLight: LightData | null;
  filterNode: NodeId | 'all';
  onSelectNode: (node: NodeData) => void;
  onHoverLight: (light: LightData | null) => void;
}

const PULSE_ANIMATIONS: Record<string, string> = {
  fast: 'pulseAmber 1.5s ease-in-out infinite',
  medium: 'pulseAmber 3s ease-in-out infinite',
  slow: 'pulseAmber 5s ease-in-out infinite',
  ember: 'pulseAmber 9s ease-in-out infinite',
};

export default function MapCanvas({
  nodes,
  lights,
  selectedNode,
  hoveredLight,
  filterNode,
  onSelectNode,
  onHoverLight,
}: MapCanvasProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const visibleLights = filterNode === 'all'
    ? lights
    : lights.filter((l) => l.nodeId === filterNode);

  const rtanj = nodes.find((n) => n.id === 'rtanj')!;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(17,14,10,1) 0%, rgba(10,8,6,1) 100%)' }}
    >
      {/* SVG layer — ley lines + world outline */}
      <svg
        viewBox="0 0 100 80"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Simplified world continents */}
        <path
          d="M8,22 Q15,18 25,20 Q32,16 38,18 Q44,16 50,18 Q58,15 65,18 Q72,16 80,20 Q87,18 92,22 L94,58 Q85,63 75,61 Q65,65 55,62 Q45,65 35,61 Q25,63 15,60 Q8,62 6,58 Z"
          fill="none"
          stroke="rgba(200,130,42,0.08)"
          strokeWidth="0.2"
        />
        {/* North America rough */}
        <path
          d="M6,22 Q10,18 18,20 Q22,16 24,22 Q20,28 16,35 Q12,42 10,48 L8,50 Q6,45 6,38 Z"
          fill="rgba(200,130,42,0.03)"
          stroke="rgba(200,130,42,0.06)"
          strokeWidth="0.15"
        />
        {/* Europe rough */}
        <path
          d="M44,18 Q50,16 56,18 Q58,20 57,25 Q54,28 50,26 Q46,24 44,22 Z"
          fill="rgba(200,130,42,0.04)"
          stroke="rgba(200,130,42,0.08)"
          strokeWidth="0.15"
        />
        {/* Asia rough */}
        <path
          d="M56,18 Q65,14 78,18 Q86,20 90,28 Q88,36 82,40 Q74,42 66,38 Q60,34 56,28 Z"
          fill="rgba(200,130,42,0.03)"
          stroke="rgba(200,130,42,0.06)"
          strokeWidth="0.15"
        />
        {/* South America rough */}
        <path
          d="M18,46 Q24,42 28,48 Q30,56 26,66 Q22,70 18,66 Q14,60 16,52 Z"
          fill="rgba(200,130,42,0.03)"
          stroke="rgba(200,130,42,0.06)"
          strokeWidth="0.15"
        />

        {/* Ley lines — all nodes to Rtanj */}
        {nodes.filter((n) => n.id !== 'rtanj').map((node) => (
          <line
            key={`ley-${node.id}`}
            x1={node.mapX}
            y1={node.mapY}
            x2={rtanj.mapX}
            y2={rtanj.mapY}
            stroke={filterNode === 'all' || filterNode === node.id || filterNode === 'rtanj' ?'rgba(200,130,42,0.18)' :'rgba(200,130,42,0.04)'}
            strokeWidth="0.25"
            strokeDasharray="1.5 3"
            className="ley-line"
          />
        ))}

        {/* Rtanj glow rings */}
        <circle
          cx={rtanj.mapX}
          cy={rtanj.mapY}
          r="2.5"
          fill="none"
          stroke="rgba(212,175,55,0.15)"
          strokeWidth="0.3"
          className="animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <circle
          cx={rtanj.mapX}
          cy={rtanj.mapY}
          r="4"
          fill="none"
          stroke="rgba(212,175,55,0.08)"
          strokeWidth="0.2"
        />
      </svg>

      {/* Light dots layer */}
      {visibleLights.map((light) => {
        const mag = light.star_magnitude ?? 'iskra';
        const isSvemir = mag === 'svemir';
        const isSvetlost = mag === 'svetlost';

        // Gold star: active if gold_expires_at is set and in the future
        const isGold = !!(
          light.gold_expires_at &&
          new Date(light.gold_expires_at) > new Date()
        );

        const dotSize = isSvemir ? 11 : isSvetlost ? 7 : 4;
        const dotColor = isGold
          ? '#FFD700'
          : isSvemir
          ? '#D4AF37'
          : isSvetlost
          ? '#c8822a' :'#e8e0d0';
        const dotGlow = isGold
          ? '0 0 16px rgba(255,215,0,1), 0 0 32px rgba(255,215,0,0.7), 0 0 56px rgba(255,215,0,0.3)'
          : isSvemir
          ? '0 0 14px rgba(212,175,55,1), 0 0 28px rgba(212,175,55,0.6), 0 0 44px rgba(212,175,55,0.25)'
          : isSvetlost
          ? '0 0 8px rgba(200,130,42,0.9), 0 0 16px rgba(200,130,42,0.5)'
          : '0 0 4px rgba(232,224,208,0.8), 0 0 8px rgba(232,224,208,0.3)';
        const pulseAnim = isGold
          ? 'pulseAmber 1.8s ease-in-out infinite'
          : isSvemir
          ? 'pulseAmber 2.5s ease-in-out infinite'
          : isSvetlost
          ? 'pulseAmber 3.5s ease-in-out infinite'
          : PULSE_ANIMATIONS[light.pulseSpeed];

        return (
          <div
            key={light.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${light.mapX}%`,
              top: `${light.mapY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: hoveredLight?.id === light.id ? 20 : isGold ? 14 : isSvemir ? 12 : 10,
            }}
            onMouseEnter={() => onHoverLight(light)}
            onMouseLeave={() => onHoverLight(null)}
          >
            {/* Gold halo rings */}
            {isGold && (
              <>
                <div
                  className="absolute"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'svemirHaloMap 2.5s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,215,0,0.5)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'svemirRingMap 2.5s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}

            {/* Svemir halo rings */}
            {isSvemir && !isGold && (
              <>
                <div
                  className="absolute"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'svemirHaloMap 3s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: '1px solid rgba(212,175,55,0.4)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: 'svemirRingMap 3s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
              </>
            )}

            {/* Outer glow ring on hover */}
            {hoveredLight?.id === light.id && (
              <div
                className="absolute"
                style={{
                  width: isSvemir ? '28px' : '20px',
                  height: isSvemir ? '28px' : '20px',
                  borderRadius: '50%',
                  border: `1px solid ${isSvemir ? 'rgba(212,175,55,0.6)' : isSvetlost ? 'rgba(200,130,42,0.5)' : 'rgba(232,224,208,0.4)'}`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}

            {/* Core dot */}
            <div
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                background: dotColor,
                boxShadow: dotGlow,
                animation: pulseAnim,
                position: 'relative',
                zIndex: 2,
              }}
            />

            {/* Tooltip */}
            {hoveredLight?.id === light.id && (
              <div
                className="absolute nmq-card p-3 pointer-events-none"
                style={{
                  bottom: '150%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  minWidth: '180px',
                  maxWidth: '240px',
                  zIndex: 30,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  {isGold && (
                    <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#FFD700' }}>
                      ✦ VOICE ·
                    </span>
                  )}
                  {isSvemir && !isGold && (
                    <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#D4AF37' }}>
                      SVEMIR ·
                    </span>
                  )}
                  {isSvetlost && !isSvemir && (
                    <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
                      SVETLOST ·
                    </span>
                  )}
                  {light.isBuilder && (
                    <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#f0e8d8' }}>
                      BUILDER ·
                    </span>
                  )}
                  {light.isFounding && (
                    <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#D4AF37' }}>
                      FOUNDING ·
                    </span>
                  )}
                  <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                    Light #{light.id.split('-')[1]} · {light.age} ago
                  </span>
                </div>
                {light.fragment ? (
                  <p className="font-cormorant italic text-cream/80 text-xs leading-relaxed">
                    &ldquo;{light.fragment}&rdquo;
                  </p>
                ) : (
                  <p className="font-cormorant italic text-silence text-xs">
                    No fragment left.
                  </p>
                )}
                <p className="nmq-label mt-1.5" style={{ fontSize: '0.4rem', color: '#c8822a' }}>
                  {nodes.find((n) => n.id === light.nodeId)?.name}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Node dots */}
      {nodes.map((node) => {
        const isFiltered = filterNode !== 'all' && filterNode !== node.id;
        return (
          <div
            key={`map-node-${node.id}`}
            className="absolute cursor-pointer"
            style={{
              left: `${node.mapX}%`,
              top: `${node.mapY}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 15,
              opacity: isFiltered ? 0.3 : 1,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => onSelectNode(node)}
          >
            {/* Outer ring */}
            <div
              className="absolute transition-all duration-300"
              style={{
                width: node.isCenter ? '28px' : '20px',
                height: node.isCenter ? '28px' : '20px',
                borderRadius: '50%',
                border: `1px solid ${node.isCenter ? 'rgba(212,175,55,0.4)' : 'rgba(200,130,42,0.3)'}`,
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${hoveredNode === node.id ? 1.3 : 1})`,
              }}
            />
            {/* Core */}
            <div
              style={{
                width: node.isCenter ? '10px' : '7px',
                height: node.isCenter ? '10px' : '7px',
                borderRadius: '50%',
                background: node.isCenter ? '#D4AF37' : '#c8822a',
                boxShadow: node.isCenter
                  ? '0 0 16px rgba(212,175,55,0.9), 0 0 32px rgba(212,175,55,0.5)'
                  : '0 0 8px rgba(200,130,42,0.8), 0 0 16px rgba(200,130,42,0.4)',
                animation: node.isCenter ? 'pulseAmber 2s ease-in-out infinite' : 'pulseAmber 4s ease-in-out infinite',
              }}
            />

            {/* Node label on hover */}
            {hoveredNode === node.id && (
              <div
                className="absolute nmq-card px-3 py-2 pointer-events-none"
                style={{
                  bottom: '140%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  zIndex: 25,
                }}
              >
                <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#c8822a' }}>
                  {node.label}
                </p>
                <p className="font-cormorant font-light text-cream text-sm">{node.name}</p>
              </div>
            )}
          </div>
        );
      })}

      {/* Corner info */}
      <div className="absolute top-4 right-4 text-right pointer-events-none">
        <p className="nmq-label" style={{ fontSize: '0.45rem', color: '#5a4e40', letterSpacing: '0.25em' }}>
          ALL PATHS LEAD TO RTANJ
        </p>
        <p className="nmq-label mt-1" style={{ fontSize: '0.4rem', color: '#3a3028' }}>
          43°46′N · 21°50′E
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 nmq-card p-3 pointer-events-none">
        <p className="nmq-label mb-2" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>LEGEND</p>
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'legend-gold', color: '#FFD700', size: 7, label: 'Voice of the mountain', shadow: '0 0 10px rgba(255,215,0,0.9)' },
            { id: 'legend-builder', color: '#f0e8d8', size: 7, label: 'Builder light', shadow: '0 0 8px rgba(240,232,216,0.8)' },
            { id: 'legend-founding', color: '#D4AF37', size: 6, label: 'Founding light', shadow: '0 0 8px rgba(212,175,55,0.8)' },
            { id: 'legend-active', color: '#c8822a', size: 4, label: 'Active light', shadow: '0 0 5px rgba(200,130,42,0.7)' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <div
                style={{
                  width: `${item.size}px`,
                  height: `${item.size}px`,
                  borderRadius: '50%',
                  background: item.color,
                  boxShadow: item.shadow,
                  flexShrink: 0,
                }}
              />
              <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#a89880' }}>
                {item.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-1">
            <div style={{ width: '16px', height: '1px', background: 'rgba(200,130,42,0.3)', borderTop: '1px dashed rgba(200,130,42,0.3)' }} />
            <span className="nmq-label" style={{ fontSize: '0.4rem', color: '#a89880' }}>Ley line</span>
          </div>
        </div>
      </div>
    </div>
  );
}