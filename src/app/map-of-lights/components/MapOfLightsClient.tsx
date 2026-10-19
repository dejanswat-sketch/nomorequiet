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
    description: 'An uninhabited rock rising from the Mediterranean off Ibiza. Compasses deviate here. Things are drawn without reason.',
    metaphor: 'Sea, magnetic pull, isolation.',
    mapX: 49,
    mapY: 40,
    isCenter: false,
  },
];

export default function MapOfLightsClient() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredLight, setHoveredLight] = useState<LightData | null>(null);
  const [filterNode, setFilterNode] = useState<NodeId | 'all'>('all');
  const [lights, setLights] = useState<LightData[]>([]);
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
        // Bez lazNIH podataka: ako baza ne odgovori, mapa ostaje prazna
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

        {/* Poštena prazna mapa (Koncept v2): dok nema unosa, ne izmišljamo ih */}
        {!lightsLoading && lights.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8 text-center">
            <p className="font-cormorant font-light italic text-cream/75 text-xl md:text-2xl">
              Nothing has been written here yet.
            </p>
            <p className="nmq-label mt-4" style={{ fontSize: '0.5rem', color: '#5a4e40' }}>
              The first light could be yours
            </p>
          </div>
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