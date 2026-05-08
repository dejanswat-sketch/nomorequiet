'use client';

import React, { useState, useEffect } from 'react';
import MapCanvas from './MapCanvas';
import MapSidebar from './MapSidebar';
import MapNodeDetail from './MapNodeDetail';
import { lightService } from '@/lib/services/lightService';
import { trackMapNodeViewed } from '@/lib/analytics';
import FeaturedStoryWidget from '@/components/FeaturedStoryWidget';

export type NodeId = 'rtanj' | 'sedona' | 'kailash' | 'shasta' | 'glastonbury' | 'machu_picchu' | 'esvedra';

export interface NodeData {
  id: NodeId;
  name: string;
  label: string;
  coords: string;
  lat: number;
  lng: number;
  lightCount: number;
  foundingLights: number;
  description: string;
  metaphor: string;
  mapX: number;
  mapY: number;
  isCenter: boolean;
}

export interface LightData {
  id: string;
  nodeId: NodeId;
  fragment: string;
  age: string;
  isFounding: boolean;
  isBuilder: boolean;
  pulseSpeed: 'fast' | 'medium' | 'slow' | 'ember';
  mapX: number;
  mapY: number;
  star_magnitude?: 'iskra' | 'svetlost' | 'svemir';
  gold_expires_at?: string | null;
}

export const NODES: NodeData[] = [
  {
    id: 'rtanj',
    name: 'Rtanj',
    label: 'THE HOUSE',
    coords: '43°46′N · 21°50′E',
    lat: 43.77,
    lng: 21.83,
    lightCount: 847,
    foundingLights: 1000,
    description: 'The center of all paths. A pyramid-shaped mountain in Serbia where people have gathered for centuries seeking something they could not name.',
    metaphor: 'Fire, earth, stone, silence.',
    mapX: 53.5,
    mapY: 36,
    isCenter: true,
  },
  {
    id: 'sedona',
    name: 'Sedona',
    label: 'THE VORTEX',
    coords: '34°52′N · 111°47′W',
    lat: 34.87,
    lng: -111.78,
    lightCount: 213,
    foundingLights: 0,
    description: 'Red rock country where vortexes of energy spiral from the earth. A place people travel to when they are circling something.',
    metaphor: 'Sand, wind, spiral.',
    mapX: 14,
    mapY: 40,
    isCenter: false,
  },
  {
    id: 'kailash',
    name: 'Mount Kailash',
    label: 'THE CROWN',
    coords: '31°04′N · 81°18′E',
    lat: 31.07,
    lng: 81.31,
    lightCount: 156,
    foundingLights: 0,
    description: 'Sacred to four religions. No one has ever climbed it. At this altitude, only what is true can breathe.',
    metaphor: 'Ice, altitude, breath, void.',
    mapX: 70,
    mapY: 38,
    isCenter: false,
  },
  {
    id: 'shasta',
    name: 'Mount Shasta',
    label: 'THE SOURCE',
    coords: '41°24′N · 122°11′W',
    lat: 41.41,
    lng: -122.19,
    lightCount: 189,
    foundingLights: 0,
    description: 'A volcanic peak in northern California. The source that rises from underground springs and ancient forests.',
    metaphor: 'Forest, mist, underground water.',
    mapX: 10,
    mapY: 32,
    isCenter: false,
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury',
    label: 'THE TOR',
    coords: '51°08′N · 2°42′W',
    lat: 51.14,
    lng: -2.7,
    lightCount: 174,
    foundingLights: 0,
    description: 'An ancient hill in Somerset, England. The mist comes in from the Somerset Levels and keeps things that should not be forgotten.',
    metaphor: 'Fog, ancient stone, green, myth.',
    mapX: 46,
    mapY: 24,
    isCenter: false,
  },
  {
    id: 'machu_picchu',
    name: 'Machu Picchu',
    label: 'THE CROSSING',
    coords: '13°09′S · 72°32′W',
    lat: -13.16,
    lng: -72.54,
    lightCount: 142,
    foundingLights: 0,
    description: 'A threshold in the clouds of Peru. The place where one thing ends and another has not yet begun.',
    metaphor: 'Cloud, altitude, ruins, threshold.',
    mapX: 22,
    mapY: 62,
    isCenter: false,
  },
  {
    id: 'esvedra',
    name: 'Es Vedrà',
    label: 'THE MAGNET',
    coords: '38°52′N · 1°12′E',
    lat: 38.87,
    lng: 1.2,
    lightCount: 126,
    foundingLights: 0,
    description: 'An uninhabited rock rising from the Mediterranean off Ibiza. Compasses deviate here. Things are drawn without reason.',
    metaphor: 'Sea, magnetic pull, isolation.',
    mapX: 49,
    mapY: 40,
    isCenter: false,
  },
];

export const LIGHTS: LightData[] = [
  { id: 'light-001', nodeId: 'rtanj', fragment: 'I stopped explaining myself to people who weren\'t listening.', age: '312 days', isFounding: true, isBuilder: false, pulseSpeed: 'slow', mapX: 53.2, mapY: 35.6, star_magnitude: 'svetlost' },
  { id: 'light-002', nodeId: 'rtanj', fragment: 'The weight has a shape now. That\'s something.', age: '289 days', isFounding: true, isBuilder: false, pulseSpeed: 'slow', mapX: 54.1, mapY: 36.4, star_magnitude: 'iskra' },
  { id: 'light-003', nodeId: 'rtanj', fragment: 'I came here because I had nowhere else to put this.', age: '401 days', isFounding: true, isBuilder: false, pulseSpeed: 'ember', mapX: 52.8, mapY: 35.2, star_magnitude: 'svemir' },
  { id: 'light-004', nodeId: 'rtanj', fragment: 'Still here. Still carrying it. But less alone.', age: '356 days', isFounding: true, isBuilder: false, pulseSpeed: 'ember', mapX: 53.8, mapY: 37.1, star_magnitude: 'svetlost' },
  { id: 'light-005', nodeId: 'rtanj', fragment: 'The stone is lighter when I say its name.', age: '445 days', isFounding: true, isBuilder: true, pulseSpeed: 'ember', mapX: 53.5, mapY: 36.8, star_magnitude: 'svemir' },
  { id: 'light-006', nodeId: 'rtanj', fragment: 'Something moved today. I can\'t explain it. It moved.', age: '18 days', isFounding: false, isBuilder: false, pulseSpeed: 'fast', mapX: 54.3, mapY: 35.9, star_magnitude: 'iskra' },
  { id: 'light-007', nodeId: 'rtanj', fragment: 'I wrote for the first time in years. It felt like breathing.', age: '4 days', isFounding: false, isBuilder: false, pulseSpeed: 'fast', mapX: 52.6, mapY: 36.2, star_magnitude: 'iskra' },
  { id: 'light-008', nodeId: 'sedona', fragment: 'The spiral has been turning since before I noticed.', age: '67 days', isFounding: false, isBuilder: false, pulseSpeed: 'medium', mapX: 13.8, mapY: 39.7, star_magnitude: 'svetlost' },
  { id: 'light-009', nodeId: 'sedona', fragment: 'I keep circling the same question. Maybe that\'s the answer.', age: '134 days', isFounding: false, isBuilder: false, pulseSpeed: 'slow', mapX: 14.4, mapY: 40.3, star_magnitude: 'iskra' },
  { id: 'light-010', nodeId: 'kailash', fragment: 'At this altitude, I can only carry what is true.', age: '203 days', isFounding: false, isBuilder: false, pulseSpeed: 'slow', mapX: 70.2, mapY: 37.8, star_magnitude: 'svemir' },
  { id: 'light-011', nodeId: 'glastonbury', fragment: 'Quiet is not the same as peace. I\'m learning the difference.', age: '178 days', isFounding: false, isBuilder: false, pulseSpeed: 'slow', mapX: 46.2, mapY: 24.3, star_magnitude: 'svetlost' },
  { id: 'light-012', nodeId: 'shasta', fragment: 'I don\'t know what I\'m waiting for. Maybe that\'s the point.', age: '223 days', isFounding: false, isBuilder: false, pulseSpeed: 'slow', mapX: 10.3, mapY: 32.4, star_magnitude: 'iskra' },
  { id: 'light-013', nodeId: 'machu_picchu', fragment: 'At the threshold. Not ready to cross. But here.', age: '45 days', isFounding: false, isBuilder: false, pulseSpeed: 'medium', mapX: 22.1, mapY: 62.3, star_magnitude: 'iskra' },
  { id: 'light-014', nodeId: 'esvedra', fragment: 'The sea pulled me here. I stopped asking why.', age: '89 days', isFounding: false, isBuilder: false, pulseSpeed: 'medium', mapX: 49.2, mapY: 40.1, star_magnitude: 'svetlost' },
  { id: 'light-015', nodeId: 'rtanj', fragment: 'I don\'t need to be fixed. I needed to be heard.', age: '12 days', isFounding: false, isBuilder: false, pulseSpeed: 'fast', mapX: 53.1, mapY: 36.6, star_magnitude: 'iskra' },
  { id: 'light-016', nodeId: 'rtanj', fragment: '', age: '3 days', isFounding: false, isBuilder: false, pulseSpeed: 'fast', mapX: 54.0, mapY: 35.5, star_magnitude: 'iskra' },
];

export default function MapOfLightsClient() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredLight, setHoveredLight] = useState<LightData | null>(null);
  const [filterNode, setFilterNode] = useState<NodeId | 'all'>('all');
  const [lights, setLights] = useState<LightData[]>(LIGHTS);
  const [lightsLoading, setLightsLoading] = useState(true);

  const handleSelectNode = (node: NodeData | null) => {
    if (node) trackMapNodeViewed(node.id);
    setSelectedNode(node);
  };

  // Load lights from Supabase and subscribe to real-time updates
  useEffect(() => {
    lightService.getAll()
      .then((dbLights) => {
        if (dbLights.length > 0) {
          const mapped: LightData[] = dbLights.map((l) => ({
            id: l.id,
            nodeId: l.nodeId as NodeId,
            fragment: l.fragment ?? '',
            age: formatAge(l.createdAt),
            isFounding: l.isFounding,
            isBuilder: l.isBuilder,
            pulseSpeed: (l.pulseSpeed as LightData['pulseSpeed']) ?? 'medium',
            mapX: l.mapX,
            mapY: l.mapY,
            star_magnitude: l.starMagnitude as LightData['star_magnitude'],
            gold_expires_at: (l as Record<string, unknown>).goldExpiresAt as string | null ?? null,
          }));
          setLights(mapped);
        }
      })
      .catch(() => {
        // Keep mock lights on error
      })
      .finally(() => setLightsLoading(false));

    const unsubscribe = lightService.subscribeToAll((dbLights) => {
      if (dbLights.length > 0) {
        const mapped: LightData[] = dbLights.map((l) => ({
          id: l.id,
          nodeId: l.nodeId as NodeId,
          fragment: l.fragment ?? '',
          age: formatAge(l.createdAt),
          isFounding: l.isFounding,
          isBuilder: l.isBuilder,
          pulseSpeed: (l.pulseSpeed as LightData['pulseSpeed']) ?? 'medium',
          mapX: l.mapX,
          mapY: l.mapY,
          star_magnitude: l.starMagnitude as LightData['star_magnitude'],
          gold_expires_at: (l as Record<string, unknown>).goldExpiresAt as string | null ?? null,
        }));
        setLights(mapped);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <MapSidebar
        nodes={NODES}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
        filterNode={filterNode}
        onFilterChange={setFilterNode}
        totalLights={lights.length}
      />

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        {lightsLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="light-dot pulse-amber" style={{ width: '8px', height: '8px' }} />
          </div>
        ) : (
          <MapCanvas
            nodes={NODES}
            lights={lights}
            selectedNode={selectedNode}
            hoveredLight={hoveredLight}
            filterNode={filterNode}
            onSelectNode={handleSelectNode}
            onHoverLight={setHoveredLight}
          />
        )}

        {/* Node detail overlay */}
        {selectedNode && (
          <MapNodeDetail
            node={selectedNode}
            lights={lights.filter((l) => l.nodeId === selectedNode.id)}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Featured Story Widget — bottom-right floating overlay */}
        {!selectedNode && (
          <div className="absolute bottom-6 right-6 z-20 w-80">
            <FeaturedStoryWidget />
          </div>
        )}
      </div>
    </div>
  );
}

function formatAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
}