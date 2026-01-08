'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface LayerNode {
  id: string;
  label: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'box' | 'component' | 'vlan' | 'service';
  color?: string;
}

interface LayerData {
  id: string;
  title: string;
  subtitle: string;
  y: number;
  height: number;
  color: string;
  darkColor: string;
  nodes: LayerNode[];
  annotations?: string[];
}

const layers: LayerData[] = [
  {
    id: 'core',
    title: 'CORE / TRANSPORT LAYER',
    subtitle: 'MPLS / IP Backbone',
    y: 0,
    height: 180,
    color: '#dbeafe',
    darkColor: '#1e3a8a',
    nodes: [
      { id: 'core-router-1', label: 'Core Router', description: 'P/PE', x: 100, y: 60, width: 140, height: 60, type: 'component', color: '#3b82f6' },
      { id: 'core-router-2', label: 'Core Router', description: 'P/PE', x: 560, y: 60, width: 140, height: 60, type: 'component', color: '#3b82f6' },
      { id: 'internet-svc', label: 'Internet → IP + BGP', x: 100, y: 140, width: 180, height: 24, type: 'service', color: '#3b82f6' },
      { id: 'iptv-svc', label: 'IPTV → Multicast/MPLS', x: 300, y: 140, width: 180, height: 24, type: 'service', color: '#22c55e' },
      { id: 'voip-svc', label: 'VoIP → MPLS + QoS', x: 500, y: 140, width: 180, height: 24, type: 'service', color: '#f97316' },
    ],
    annotations: ['BGP • IS-IS • MPLS-TE', 'Pure IP/MPLS - NO VLANs'],
  },
  {
    id: 'service',
    title: 'SERVICE / CONTROL LAYER',
    subtitle: 'Logical Brain',
    y: 200,
    height: 170,
    color: '#f3e8ff',
    darkColor: '#4c1d95',
    nodes: [
      { id: 'aaa', label: 'AAA (RADIUS)', description: 'Auth/Billing', x: 80, y: 50, width: 160, height: 70, type: 'component', color: '#8b5cf6' },
      { id: 'iptv-ctrl', label: 'IPTV Control', description: 'Middleware', x: 280, y: 50, width: 160, height: 70, type: 'component', color: '#8b5cf6' },
      { id: 'voip-ctrl', label: 'VoIP Softswitch', description: 'SIP / RTP Ctrl', x: 480, y: 50, width: 170, height: 70, type: 'component', color: '#8b5cf6' },
    ],
    annotations: ['Subscriber-aware', 'Decides: Who you are, What services, Speed/Channels'],
  },
  {
    id: 'aggregation',
    title: 'AGGREGATION LAYER',
    subtitle: 'Where VLANs terminate and subscribers are born',
    y: 390,
    height: 200,
    color: '#fef3c7',
    darkColor: '#78350f',
    nodes: [
      { id: 'bng', label: 'Aggregation Switch / Edge Router / BNG (BRAS)', description: '', x: 50, y: 40, width: 600, height: 50, type: 'box', color: '#f59e0b' },
      { id: 'vlan100-agg', label: 'VLAN 100 → Internet → PPPoE/IPoE → RADIUS → VRF', x: 60, y: 100, width: 580, height: 24, type: 'vlan', color: '#3b82f6' },
      { id: 'vlan200-agg', label: 'VLAN 200 → IPTV → IGMP Proxy → Multicast Domain', x: 60, y: 130, width: 580, height: 24, type: 'vlan', color: '#22c55e' },
      { id: 'vlan300-agg', label: 'VLAN 300 → VoIP → SIP Registration → Softswitch', x: 60, y: 160, width: 580, height: 24, type: 'vlan', color: '#f97316' },
    ],
    annotations: ['VLANs DIE here ❌', 'No VLAN identity survives after this point'],
  },
  {
    id: 'access',
    title: 'ACCESS LAYER',
    subtitle: 'Ethernet world – VLANs, Q-in-Q, QoS',
    y: 610,
    height: 230,
    color: '#d1fae5',
    darkColor: '#064e3b',
    nodes: [
      { id: 'olt', label: 'OLT (GPON / XGS)', description: '', x: 280, y: 30, width: 140, height: 50, type: 'component', color: '#10b981' },
      { id: 'svlan100', label: 'S-VLAN 100 – Internet (Best Effort)', description: 'C-VLAN per ONU/Port', x: 60, y: 100, width: 580, height: 30, type: 'vlan', color: '#3b82f6' },
      { id: 'svlan200', label: 'S-VLAN 200 – IPTV (High Priority, Multicast)', description: 'C-VLAN per ONU', x: 60, y: 140, width: 580, height: 30, type: 'vlan', color: '#22c55e' },
      { id: 'svlan300', label: 'S-VLAN 300 – VoIP (Highest Priority, Low Latency)', description: 'C-VLAN per ONU', x: 60, y: 180, width: 580, height: 30, type: 'vlan', color: '#f97316' },
    ],
    annotations: ['VLAN = SERVICE', 'Customer identity comes later'],
  },
  {
    id: 'cpe',
    title: 'CUSTOMER PREMISES LAYER',
    subtitle: 'CPE - First service separation point',
    y: 860,
    height: 180,
    color: '#fce7f3',
    darkColor: '#831843',
    nodes: [
      { id: 'onu', label: 'ONU / Home Gateway', description: '', x: 100, y: 35, width: 500, height: 40, type: 'box', color: '#ec4899' },
      { id: 'cpe-internet', label: 'Internet → NAT / Routing (VLAN 100)', x: 110, y: 90, width: 480, height: 24, type: 'vlan', color: '#3b82f6' },
      { id: 'cpe-iptv', label: 'IPTV → IGMP Join/Leave (VLAN 200)', x: 110, y: 120, width: 480, height: 24, type: 'vlan', color: '#22c55e' },
      { id: 'cpe-voip', label: 'VoIP → SIP + RTP (VLAN 300)', x: 110, y: 150, width: 480, height: 24, type: 'vlan', color: '#f97316' },
    ],
    annotations: ['First service separation point'],
  },
];

// Connection points between layers
const layerConnections = [
  { from: 'cpe', to: 'access', label: '' },
  { from: 'access', to: 'aggregation', label: 'VLANs DIE here' },
  { from: 'aggregation', to: 'service', label: 'Subscriber-aware' },
  { from: 'service', to: 'core', label: 'NO VLANs allowed' },
];

export default function LayersPage() {
  const [isDark, setIsDark] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    const updateDarkMode = () => {
      requestAnimationFrame(() => setIsDark(checkDark()));
    };
    updateDarkMode();
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const totalHeight = 1060;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium hover:scale-105 transition-transform duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Topology link */}
      <Link
        href="/topology"
        className="fixed top-6 right-20 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium hover:scale-105 transition-transform duration-200"
      >
        View Topology →
      </Link>

      {/* Header */}
      <header className="pt-20 pb-8 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
          >
            ISP Network Layers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Vertical stack architecture showing VLAN lifecycle from CPE to Core
          </motion.p>
        </div>
      </header>

      {/* Main Diagram */}
      <main className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 overflow-x-auto"
          >
            <svg
              viewBox={`0 0 700 ${totalHeight}`}
              className="w-full h-auto"
              style={{ minHeight: '800px' }}
            >
              <defs>
                <marker id="arrow-up" markerWidth="10" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <polygon points="0 7, 5 0, 10 7" fill={isDark ? '#9ca3af' : '#6b7280'} />
                </marker>
              </defs>

              {/* Layer backgrounds and content */}
              {layers.map((layer, layerIndex) => {
                const isHovered = hoveredLayer === layer.id;
                return (
                  <g
                    key={layer.id}
                    onMouseEnter={() => setHoveredLayer(layer.id)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    {/* Layer background */}
                    <rect
                      x={10}
                      y={layer.y + 10}
                      width={680}
                      height={layer.height}
                      rx={16}
                      fill={isDark ? layer.darkColor : layer.color}
                      opacity={isHovered ? 1 : 0.7}
                      stroke={isHovered ? (isDark ? '#fff' : '#1f2937') : 'transparent'}
                      strokeWidth={2}
                      className="transition-all duration-200 cursor-pointer"
                    />

                    {/* Layer title */}
                    <text
                      x={30}
                      y={layer.y + 35}
                      className="text-sm font-bold"
                      fill={isDark ? '#fff' : '#1f2937'}
                    >
                      {layer.title}
                    </text>
                    <text
                      x={30}
                      y={layer.y + 52}
                      className="text-xs"
                      fill={isDark ? '#d1d5db' : '#4b5563'}
                    >
                      {layer.subtitle}
                    </text>

                    {/* Nodes */}
                    {layer.nodes.map((node) => (
                      <g key={node.id}>
                        {node.type === 'component' || node.type === 'box' ? (
                          <>
                            <rect
                              x={node.x}
                              y={layer.y + node.y}
                              width={node.width}
                              height={node.height}
                              rx={8}
                              fill={isDark ? '#374151' : '#fff'}
                              stroke={node.color}
                              strokeWidth={2}
                            />
                            <text
                              x={node.x + node.width / 2}
                              y={layer.y + node.y + (node.description ? node.height / 2 - 6 : node.height / 2 + 4)}
                              textAnchor="middle"
                              className="text-xs font-semibold"
                              fill={isDark ? '#fff' : '#1f2937'}
                            >
                              {node.label}
                            </text>
                            {node.description && (
                              <text
                                x={node.x + node.width / 2}
                                y={layer.y + node.y + node.height / 2 + 10}
                                textAnchor="middle"
                                className="text-[10px]"
                                fill={isDark ? '#9ca3af' : '#6b7280'}
                              >
                                {node.description}
                              </text>
                            )}
                          </>
                        ) : node.type === 'vlan' ? (
                          <>
                            <rect
                              x={node.x}
                              y={layer.y + node.y}
                              width={node.width}
                              height={node.height}
                              rx={4}
                              fill={node.color}
                              opacity={0.15}
                            />
                            <rect
                              x={node.x}
                              y={layer.y + node.y}
                              width={4}
                              height={node.height}
                              rx={2}
                              fill={node.color}
                            />
                            <text
                              x={node.x + 14}
                              y={layer.y + node.y + node.height / 2 + 4}
                              className="text-[11px] font-medium"
                              fill={isDark ? '#fff' : '#1f2937'}
                            >
                              {node.label}
                            </text>
                            {node.description && (
                              <text
                                x={node.x + node.width - 10}
                                y={layer.y + node.y + node.height / 2 + 4}
                                textAnchor="end"
                                className="text-[10px]"
                                fill={isDark ? '#9ca3af' : '#6b7280'}
                              >
                                {node.description}
                              </text>
                            )}
                          </>
                        ) : node.type === 'service' ? (
                          <>
                            <rect
                              x={node.x}
                              y={layer.y + node.y}
                              width={node.width}
                              height={node.height}
                              rx={12}
                              fill={node.color}
                              opacity={0.2}
                            />
                            <text
                              x={node.x + node.width / 2}
                              y={layer.y + node.y + node.height / 2 + 4}
                              textAnchor="middle"
                              className="text-[10px] font-medium"
                              fill={isDark ? '#fff' : '#374151'}
                            >
                              {node.label}
                            </text>
                          </>
                        ) : null}
                      </g>
                    ))}

                    {/* Annotations */}
                    {layer.annotations && (
                      <g>
                        {layer.annotations.map((anno, i) => (
                          <text
                            key={i}
                            x={680}
                            y={layer.y + layer.height - 15 - (layer.annotations!.length - 1 - i) * 14}
                            textAnchor="end"
                            className="text-[10px] italic"
                            fill={isDark ? '#9ca3af' : '#6b7280'}
                          >
                            {anno}
                          </text>
                        ))}
                      </g>
                    )}

                    {/* Connection arrow to next layer */}
                    {layerIndex < layers.length - 1 && (
                      <g>
                        <line
                          x1={350}
                          y1={layer.y + layer.height + 10}
                          x2={350}
                          y2={layers[layerIndex + 1].y + 5}
                          stroke={isDark ? '#6b7280' : '#9ca3af'}
                          strokeWidth={2}
                          markerEnd="url(#arrow-up)"
                        />
                        {layerConnections[layers.length - 2 - layerIndex]?.label && (
                          <text
                            x={360}
                            y={(layer.y + layer.height + layers[layerIndex + 1].y) / 2 + 15}
                            className="text-[10px] font-medium"
                            fill={isDark ? '#f87171' : '#dc2626'}
                          >
                            {layerConnections[layers.length - 2 - layerIndex].label}
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Backbone connection line */}
              <line
                x1={240}
                y1={layers[0].y + 90}
                x2={560}
                y2={layers[0].y + 90}
                stroke="#3b82f6"
                strokeWidth={4}
                strokeDasharray="8,4"
              />
              <text
                x={400}
                y={layers[0].y + 85}
                textAnchor="middle"
                className="text-[10px] font-bold"
                fill="#3b82f6"
              >
                MPLS / IP Backbone
              </text>
            </svg>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid md:grid-cols-3 gap-4"
          >
            {/* VLAN Colors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Service VLANs</h3>
              <div className="space-y-2">
                {[
                  { label: 'VLAN 100 - Internet', color: '#3b82f6' },
                  { label: 'VLAN 200 - IPTV', color: '#22c55e' },
                  { label: 'VLAN 300 - VoIP', color: '#f97316' },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Network Layers</h3>
              <div className="space-y-2">
                {layers.slice(0, 5).map((layer) => (
                  <div key={layer.id} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: isDark ? layer.darkColor : layer.color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{layer.title.split('/')[0].trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl shadow border border-amber-200 dark:border-amber-700/50 p-4">
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">🔑 Key Insight</h3>
              <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                VLANs exist only in the <strong>Access</strong> and <strong>CPE</strong> layers.
                At the <strong>Aggregation Layer</strong> (BNG/BRAS), VLANs terminate and subscribers
                are identified by session/IP. The <strong>Core</strong> sees only pure IP/MPLS traffic.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
