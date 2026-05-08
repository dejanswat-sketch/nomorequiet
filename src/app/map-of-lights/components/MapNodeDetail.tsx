'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import type { NodeData, LightData } from './MapOfLightsClient';

interface MapNodeDetailProps {
  node: NodeData;
  lights: LightData[];
  onClose: () => void;
}

export default function MapNodeDetail({ node, lights, onClose }: MapNodeDetailProps) {
  const recentFragments = lights.filter((l) => l.fragment).slice(0, 4);

  return (
    <div
      className="absolute top-4 left-4 bottom-4 w-80 nmq-card overflow-y-auto transition-all duration-300"
      style={{ zIndex: 20 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-amber/10">
        <div>
          <p className="nmq-label mb-1" style={{ fontSize: '0.5rem', color: '#c8822a' }}>
            {node.label}
          </p>
          <p className="nmq-heading text-2xl italic text-gold">{node.name}</p>
          <p className="nmq-label mt-1" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            {node.coords}
          </p>
        </div>
        <button
          className="text-silence hover:text-mist transition-colors p-1 mt-1"
          onClick={onClose}
          aria-label="Close node detail"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 border-b border-amber/8">
        <div className="p-4 text-center border-r border-amber/8">
          <p
            className="font-cormorant tabular-nums text-amber"
            style={{ fontSize: '1.6rem', fontWeight: 300 }}
          >
            {node.lightCount.toLocaleString()}
          </p>
          <p className="nmq-label mt-0.5" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            LIGHTS BURNING
          </p>
        </div>
        <div className="p-4 text-center">
          <p
            className="font-cormorant tabular-nums text-gold"
            style={{ fontSize: '1.6rem', fontWeight: 300 }}
          >
            {node.isCenter ? '1,000' : '—'}
          </p>
          <p className="nmq-label mt-0.5" style={{ fontSize: '0.45rem', color: '#5a4e40' }}>
            FOUNDING LIGHTS
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 border-b border-amber/8">
        <p className="font-cormorant italic text-cream/75 text-sm leading-relaxed">
          {node.description}
        </p>
        <p className="font-cormorant italic text-amber text-sm mt-3">
          {node.metaphor}
        </p>
      </div>

      {/* Fragments */}
      {recentFragments.length > 0 && (
        <div className="p-5">
          <p className="nmq-label mb-4" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
            FRAGMENTS FROM THIS NODE
          </p>
          <div className="flex flex-col gap-4">
            {recentFragments.map((light) => (
              <div key={light.id} className="border-l border-amber/20 pl-3">
                <p className="font-cormorant italic text-cream/70 text-sm leading-relaxed">
                  &ldquo;{light.fragment}&rdquo;
                </p>
                <p className="nmq-label mt-1" style={{ fontSize: '0.4rem', color: '#5a4e40' }}>
                  {light.isFounding ? 'Founding light · ' : ''}{light.age} ago
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-5 border-t border-amber/10">
        <Link href="/sign-up-login-screen" className="amber-btn w-full block text-center py-3">
          Light a Point at {node.name}
        </Link>
        <p className="font-cormorant italic text-silence text-xs text-center mt-3">
          1 € · Your fragment stays forever.
        </p>
      </div>
    </div>
  );
}