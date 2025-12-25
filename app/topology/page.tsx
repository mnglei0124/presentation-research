'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type TopologyType = 'master' | 'internet' | 'iptv' | 'voip';

interface TopologyNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'subscriber' | 'access' | 'aggregation' | 'core' | 'edge' | 'server' | 'external';
  description?: string;
  ha?: boolean; // High Availability pair
  vlan?: string;
}

interface TopologyConnection {
  from: string;
  to: string;
  service?: 'internet' | 'iptv' | 'voip' | 'all';
  style?: 'solid' | 'dashed';
  label?: string;
}

interface TopologyData {
  title: string;
  description: string;
  color: string;
  viewBox: string;
  nodes: TopologyNode[];
  connections: TopologyConnection[];
}

// Service colors
const serviceColors = {
  internet: { main: '#3b82f6', light: '#93c5fd', dark: '#1d4ed8', bg: '#eff6ff' },
  iptv: { main: '#22c55e', light: '#86efac', dark: '#15803d', bg: '#f0fdf4' },
  voip: { main: '#f97316', light: '#fdba74', dark: '#c2410c', bg: '#fff7ed' },
  core: { main: '#8b5cf6', light: '#c4b5fd', dark: '#6d28d9', bg: '#f5f3ff' },
};

// Master diagram with all services
const masterTopology: TopologyData = {
  title: 'Complete Triple Play Architecture',
  description: 'Unified view: Internet (VLAN 100), IPTV (VLAN 200), VoIP (VLAN 300)',
  color: 'from-violet-500 to-purple-600',
  viewBox: '0 0 1500 850',
  nodes: [
    // Layer 1: Subscriber devices (leftmost)
    { id: 'pc', label: 'PC/Laptop', x: 30, y: 150, type: 'subscriber', description: 'Internet Device' },
    { id: 'stb', label: 'STB', x: 30, y: 280, type: 'subscriber', description: 'IPTV Set-top Box' },
    { id: 'phone', label: 'Telephone', x: 30, y: 410, type: 'subscriber', description: 'VoIP Phone' },
    
    // Home Gateway - central hub for all devices
    { id: 'home', label: 'Home Gateway', x: 170, y: 280, type: 'subscriber', description: 'Triple Play CPE / VLAN Tagging' },
    
    // Layer 2: Access Network
    { id: 'ont', label: 'ONT/MDU', x: 320, y: 280, type: 'access', description: 'Optical Terminal' },
    { id: 'splitter', label: 'Splitter', x: 450, y: 280, type: 'access', description: '1:32 Passive' },
    { id: 'olt', label: 'OLT', x: 580, y: 280, type: 'access', description: 'GPON Head-end', vlan: 'VLAN 100/200/300' },
    
    // Layer 3: Aggregation (Metro)
    { id: 'metro1', label: 'Metro-A', x: 730, y: 240, type: 'aggregation', description: 'Active', ha: true },
    { id: 'metro2', label: 'Metro-S', x: 730, y: 340, type: 'aggregation', description: 'Standby', ha: true },
    
    // Layer 4: Core Services
    { id: 'bras1', label: 'BRAS-1', x: 890, y: 180, type: 'core', description: 'Active Pair', ha: true },
    { id: 'bras2', label: 'BRAS-2', x: 890, y: 280, type: 'core', description: 'Standby Pair', ha: true },
    { id: 'spine', label: 'SPINE', x: 890, y: 420, type: 'core', description: 'Multicast/Unicast' },
    
    // Layer 5: Core Network
    { id: 'hcore', label: 'HCORE', x: 1050, y: 220, type: 'core', description: 'Core Router' },
    { id: 'sig', label: 'SIG', x: 1180, y: 220, type: 'core', description: 'NAT/Security' },
    
    // Layer 6: Edge / External
    { id: 'igw', label: 'IGW', x: 1310, y: 150, type: 'edge', description: 'Internet Gateway' },
    { id: 'mix', label: 'MIX', x: 1310, y: 290, type: 'external', description: 'Mongolian IXP' },
    { id: 'public', label: 'Internet', x: 1410, y: 150, type: 'external' },
    
    // Support Servers
    { id: 'dhcp', label: 'DHCP', x: 790, y: 80, type: 'server', description: 'IP Assignment' },
    { id: 'radius', label: 'RADIUS', x: 900, y: 80, type: 'server', description: 'AAA' },
    { id: 'db', label: 'DB', x: 1010, y: 80, type: 'server', description: 'Subscriber DB' },
    { id: 'dns', label: 'DNS', x: 1150, y: 80, type: 'server', description: 'Name Resolution' },
    
    // CDN Layer
    { id: 'hcdn', label: 'HCDN', x: 1130, y: 420, type: 'server', description: 'CDN Platform' },
    { id: 'cdn', label: 'CDN Cache', x: 1280, y: 420, type: 'server', description: 'Edge Cache' },
    
    // VoIP External
    { id: 'voicecore', label: 'Voice Core', x: 1050, y: 520, type: 'external', description: 'SIP/RTP' },
    { id: 'voiceserver', label: 'Voice Server', x: 1200, y: 520, type: 'external', description: 'PBX' },
    
    // IPTV Sources  
    { id: 'multicast', label: 'Live TV', x: 890, y: 550, type: 'server', description: 'Multicast Source' },
    { id: 'vod', label: 'VOD', x: 1010, y: 550, type: 'server', description: 'Unicast VOD' },
  ],
  connections: [
    // All subscriber devices connect to Home Gateway first
    { from: 'pc', to: 'home', service: 'internet' },
    { from: 'stb', to: 'home', service: 'iptv' },
    { from: 'phone', to: 'home', service: 'voip' },
    
    // Home Gateway to ONT (all services)
    { from: 'home', to: 'ont', service: 'all' },
    
    // Access path
    { from: 'ont', to: 'splitter', service: 'all' },
    { from: 'splitter', to: 'olt', service: 'all' },
    
    // OLT to Metro (HA)
    { from: 'olt', to: 'metro1', service: 'all' },
    { from: 'olt', to: 'metro2', service: 'all', style: 'dashed' },
    
    // Metro to BRAS (Internet/VoIP)
    { from: 'metro1', to: 'bras1', service: 'internet', label: 'VLAN 100' },
    { from: 'metro1', to: 'bras2', service: 'internet', style: 'dashed' },
    
    // Metro to SPINE (IPTV)
    { from: 'metro1', to: 'spine', service: 'iptv', label: 'VLAN 200' },
    
    // BRAS to core
    { from: 'bras1', to: 'hcore', service: 'internet' },
    { from: 'hcore', to: 'sig', service: 'internet' },
    { from: 'sig', to: 'igw', service: 'internet' },
    { from: 'igw', to: 'public', service: 'internet' },
    { from: 'sig', to: 'mix', service: 'internet' },
    
    // Support services
    { from: 'dhcp', to: 'bras1', service: 'internet' },
    { from: 'radius', to: 'bras1', service: 'internet' },
    { from: 'db', to: 'radius', service: 'internet' },
    { from: 'dns', to: 'hcore', service: 'internet' },
    
    // CDN
    { from: 'hcore', to: 'hcdn', service: 'internet' },
    { from: 'sig', to: 'hcdn', service: 'internet' },
    { from: 'hcdn', to: 'cdn', service: 'internet' },
    
    // VoIP path
    { from: 'bras1', to: 'voicecore', service: 'voip', label: 'VLAN 300' },
    { from: 'voicecore', to: 'voiceserver', service: 'voip', style: 'dashed' },
    
    // IPTV sources
    { from: 'multicast', to: 'spine', service: 'iptv' },
    { from: 'vod', to: 'spine', service: 'iptv' },
  ],
};

// Internet-only diagram
const internetTopology: TopologyData = {
  title: 'Internet Service',
  description: 'Best-effort unicast traffic via VLAN 100',
  color: 'from-blue-500 to-cyan-500',
  viewBox: '0 0 1400 500',
  nodes: [
    { id: 'pc', label: 'PC/Laptop', x: 30, y: 220, type: 'subscriber', description: 'Internet Device' },
    { id: 'home', label: 'Home Gateway', x: 150, y: 220, type: 'subscriber', description: 'Triple Play CPE' },
    { id: 'ont', label: 'ONT', x: 280, y: 220, type: 'access' },
    { id: 'splitter', label: 'Splitter', x: 400, y: 220, type: 'access' },
    { id: 'olt', label: 'OLT', x: 520, y: 220, type: 'access', vlan: 'VLAN 100' },
    { id: 'metro', label: 'Metro Cluster', x: 660, y: 220, type: 'aggregation', ha: true },
    { id: 'bras', label: 'BRAS', x: 810, y: 220, type: 'core', ha: true },
    { id: 'hcore', label: 'HCORE', x: 950, y: 220, type: 'core' },
    { id: 'sig', label: 'SIG', x: 1080, y: 220, type: 'core', description: 'CGNAT' },
    { id: 'igw', label: 'IGW', x: 1200, y: 160, type: 'edge' },
    { id: 'public', label: 'Internet', x: 1300, y: 160, type: 'external' },
    { id: 'mix', label: 'MIX', x: 1200, y: 300, type: 'external' },
    { id: 'dhcp', label: 'DHCP', x: 720, y: 80, type: 'server' },
    { id: 'radius', label: 'RADIUS', x: 840, y: 80, type: 'server' },
    { id: 'dns', label: 'DNS', x: 1020, y: 80, type: 'server' },
    { id: 'hcdn', label: 'HCDN', x: 1000, y: 380, type: 'server' },
    { id: 'cdn', label: 'CDN', x: 1150, y: 380, type: 'server' },
  ],
  connections: [
    { from: 'pc', to: 'home', service: 'internet' },
    { from: 'home', to: 'ont', service: 'internet' },
    { from: 'ont', to: 'splitter', service: 'internet' },
    { from: 'splitter', to: 'olt', service: 'internet' },
    { from: 'olt', to: 'metro', service: 'internet' },
    { from: 'metro', to: 'bras', service: 'internet' },
    { from: 'bras', to: 'hcore', service: 'internet' },
    { from: 'hcore', to: 'sig', service: 'internet' },
    { from: 'sig', to: 'igw', service: 'internet' },
    { from: 'igw', to: 'public', service: 'internet' },
    { from: 'sig', to: 'mix', service: 'internet' },
    { from: 'dhcp', to: 'bras', service: 'internet' },
    { from: 'radius', to: 'bras', service: 'internet' },
    { from: 'dns', to: 'hcore', service: 'internet' },
    { from: 'hcore', to: 'hcdn', service: 'internet' },
    { from: 'hcdn', to: 'cdn', service: 'internet' },
  ],
};

// IPTV-only diagram
const iptvTopology: TopologyData = {
  title: 'IPTV Service',
  description: 'Multicast (live TV) and Unicast (VOD) via VLAN 200',
  color: 'from-green-500 to-emerald-500',
  viewBox: '0 0 1100 450',
  nodes: [
    { id: 'tv', label: 'TV', x: 30, y: 200, type: 'subscriber' },
    { id: 'stb', label: 'STB', x: 130, y: 200, type: 'subscriber', description: 'IGMP' },
    { id: 'hg', label: 'Home Gateway', x: 250, y: 200, type: 'access' },
    { id: 'ont', label: 'ONT', x: 380, y: 200, type: 'access' },
    { id: 'splitter', label: 'Splitter', x: 500, y: 200, type: 'access' },
    { id: 'olt', label: 'OLT', x: 620, y: 200, type: 'access', vlan: 'VLAN 200', description: 'Multicast Replication' },
    { id: 'metro', label: 'Metro Cluster', x: 770, y: 200, type: 'aggregation', ha: true },
    { id: 'spine', label: 'SPINE', x: 940, y: 200, type: 'core', description: 'IGMP Proxy' },
    { id: 'multicast', label: 'Live TV', x: 870, y: 80, type: 'server', description: 'Multicast Streams' },
    { id: 'vod', label: 'VOD Server', x: 1000, y: 80, type: 'server', description: 'Unicast' },
  ],
  connections: [
    { from: 'tv', to: 'stb', service: 'iptv' },
    { from: 'stb', to: 'hg', service: 'iptv' },
    { from: 'hg', to: 'ont', service: 'iptv' },
    { from: 'ont', to: 'splitter', service: 'iptv' },
    { from: 'splitter', to: 'olt', service: 'iptv' },
    { from: 'olt', to: 'metro', service: 'iptv' },
    { from: 'metro', to: 'spine', service: 'iptv' },
    { from: 'multicast', to: 'spine', service: 'iptv', label: 'IGMP' },
    { from: 'vod', to: 'spine', service: 'iptv', label: 'HTTP/RTSP' },
  ],
};

// VoIP-only diagram  
const voipTopology: TopologyData = {
  title: 'VoIP Service',
  description: 'Real-time voice via VLAN 300 with QoS priority',
  color: 'from-orange-500 to-red-500',
  viewBox: '0 0 1200 400',
  nodes: [
    { id: 'phone', label: 'Telephone', x: 30, y: 180, type: 'subscriber' },
    { id: 'hg', label: 'Home Gateway', x: 160, y: 180, type: 'access', description: 'SIP ATA' },
    { id: 'ont', label: 'ONT', x: 290, y: 180, type: 'access' },
    { id: 'splitter', label: 'Splitter', x: 420, y: 180, type: 'access' },
    { id: 'olt', label: 'OLT', x: 550, y: 180, type: 'access', vlan: 'VLAN 300' },
    { id: 'metro', label: 'Metro Cluster', x: 700, y: 180, type: 'aggregation', ha: true },
    { id: 'bras', label: 'BRAS', x: 860, y: 180, type: 'core' },
    { id: 'voicecore', label: 'Voice Core', x: 1010, y: 180, type: 'external', description: 'SIP Trunk' },
    { id: 'voiceserver', label: 'Voice Server', x: 1010, y: 300, type: 'external', description: 'RTP Media' },
  ],
  connections: [
    { from: 'phone', to: 'hg', service: 'voip' },
    { from: 'hg', to: 'ont', service: 'voip' },
    { from: 'ont', to: 'splitter', service: 'voip' },
    { from: 'splitter', to: 'olt', service: 'voip' },
    { from: 'olt', to: 'metro', service: 'voip' },
    { from: 'metro', to: 'bras', service: 'voip' },
    { from: 'bras', to: 'voicecore', service: 'voip', label: 'SIP' },
    { from: 'voicecore', to: 'voiceserver', service: 'voip', style: 'dashed', label: 'RTP' },
  ],
};

const topologies: Record<TopologyType, TopologyData> = {
  master: masterTopology,
  internet: internetTopology,
  iptv: iptvTopology,
  voip: voipTopology,
};

const nodeTypeStyles: Record<TopologyNode['type'], { fill: string; stroke: string; darkFill: string; darkStroke: string }> = {
  subscriber: { fill: '#f3f4f6', stroke: '#6b7280', darkFill: '#374151', darkStroke: '#9ca3af' },
  access: { fill: '#dbeafe', stroke: '#3b82f6', darkFill: '#1e3a8a', darkStroke: '#60a5fa' },
  aggregation: { fill: '#e0e7ff', stroke: '#6366f1', darkFill: '#312e81', darkStroke: '#818cf8' },
  core: { fill: '#f3e8ff', stroke: '#a855f7', darkFill: '#4c1d95', darkStroke: '#c084fc' },
  edge: { fill: '#fce7f3', stroke: '#ec4899', darkFill: '#831843', darkStroke: '#f472b6' },
  server: { fill: '#d1fae5', stroke: '#10b981', darkFill: '#064e3b', darkStroke: '#34d399' },
  external: { fill: '#fef3c7', stroke: '#f59e0b', darkFill: '#78350f', darkStroke: '#fbbf24' },
};

function TopologyDiagram({ data, isDark }: { data: TopologyData; isDark: boolean }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const getNode = (id: string) => data.nodes.find(n => n.id === id);
  
  const getServiceColor = (service?: string) => {
    if (!service || service === 'all') return isDark ? '#9ca3af' : '#6b7280';
    return serviceColors[service as keyof typeof serviceColors]?.main || '#6b7280';
  };
  
  const getPath = (from: TopologyNode, to: TopologyNode) => {
    const width = from.label.length > 10 ? 110 : 100;
    const x1 = from.x + width / 2 + 40;
    const y1 = from.y + 24;
    const toWidth = to.label.length > 10 ? 110 : 100;
    const x2 = to.x + toWidth / 2 - 40;
    const y2 = to.y + 24;
    
    const dx = x2 - x1;
    const cx1 = x1 + dx * 0.3;
    const cx2 = x2 - dx * 0.3;
    
    return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
  };
  
  return (
    <div className="relative w-full overflow-x-auto">
      <svg 
        viewBox={data.viewBox}
        className="w-full h-auto"
        style={{ minHeight: '380px' }}
      >
        <defs>
          {/* Arrow markers for each service */}
          {['internet', 'iptv', 'voip', 'default'].map(service => (
            <marker
              key={service}
              id={`arrow-${service}`}
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon 
                points="0 0, 8 3, 0 6" 
                fill={service === 'default' ? (isDark ? '#6b7280' : '#9ca3af') : serviceColors[service as keyof typeof serviceColors]?.main} 
              />
            </marker>
          ))}
          <marker id="arrow-highlight" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
          </marker>
        </defs>
        
        {/* Connections */}
        {data.connections.map((conn, i) => {
          const from = getNode(conn.from);
          const to = getNode(conn.to);
          if (!from || !to) return null;
          
          const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
          const color = isHighlighted ? '#8b5cf6' : getServiceColor(conn.service);
          const markerId = isHighlighted ? 'arrow-highlight' : `arrow-${conn.service || 'default'}`;
          
          return (
            <g key={i}>
              <path
                d={getPath(from, to)}
                stroke={color}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray={conn.style === 'dashed' ? '6,4' : undefined}
                fill="none"
                markerEnd={`url(#${markerId})`}
                className="transition-all duration-200"
              />
              {conn.label && (
                <text
                  x={(from.x + to.x) / 2 + 50}
                  y={(from.y + to.y) / 2 + 20}
                  fill={color}
                  className="text-[10px] font-medium"
                  textAnchor="middle"
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Nodes */}
        {data.nodes.map((node) => {
          const styles = nodeTypeStyles[node.type];
          const isHovered = hoveredNode === node.id;
          const width = node.label.length > 10 ? 110 : 100;
          
          return (
            <g 
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              {/* HA indicator */}
              {node.ha && (
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={width + 8}
                  height={56}
                  rx={14}
                  fill="none"
                  stroke={isDark ? '#4ade80' : '#22c55e'}
                  strokeWidth={2}
                  strokeDasharray="4,3"
                  opacity={0.6}
                />
              )}
              
              {/* Main node */}
              <rect
                x={node.x}
                y={node.y}
                width={width}
                height={48}
                rx={10}
                fill={isDark ? styles.darkFill : styles.fill}
                stroke={isHovered ? '#8b5cf6' : (isDark ? styles.darkStroke : styles.stroke)}
                strokeWidth={isHovered ? 3 : 2}
                strokeDasharray={node.type === 'external' ? '5,3' : undefined}
                style={{ 
                  filter: isHovered ? 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.4))' : undefined,
                  transform: isHovered ? 'scale(1.05)' : undefined,
                  transformOrigin: `${node.x + width/2}px ${node.y + 24}px`,
                  transition: 'all 0.2s ease'
                }}
              />
              
              {/* Label */}
              <text
                x={node.x + width / 2}
                y={node.y + 28}
                textAnchor="middle"
                className="text-xs font-semibold pointer-events-none"
                fill={isDark ? (isHovered ? '#fff' : styles.darkStroke) : (isDark ? '#fff' : '#374151')}
              >
                {node.label}
              </text>
              
              {/* VLAN tag */}
              {node.vlan && (
                <text
                  x={node.x + width / 2}
                  y={node.y + 42}
                  textAnchor="middle"
                  className="text-[9px] pointer-events-none"
                  fill={isDark ? '#9ca3af' : '#6b7280'}
                >
                  {node.vlan}
                </text>
              )}
              
              {/* Tooltip */}
              {isHovered && node.description && (
                <g>
                  <rect
                    x={node.x - 10}
                    y={node.y - 32}
                    width={Math.max(width + 20, node.description.length * 6.5)}
                    height={24}
                    rx={6}
                    fill={isDark ? '#1f2937' : '#111827'}
                    opacity={0.95}
                  />
                  <text
                    x={node.x + width / 2}
                    y={node.y - 14}
                    textAnchor="middle"
                    fill="white"
                    className="text-[11px]"
                  >
                    {node.description}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function TopologyPage() {
  const [activeTopology, setActiveTopology] = useState<TopologyType>('master');
  const [isDark, setIsDark] = useState(false);
  const currentData = topologies[activeTopology];
  
  useEffect(() => {
    const checkDark = () => document.documentElement.classList.contains('dark');
    
    // Use requestAnimationFrame to avoid synchronous setState in effect
    const updateDarkMode = () => {
      requestAnimationFrame(() => {
        setIsDark(checkDark());
      });
    };
    
    updateDarkMode();
    
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  
  const tabs: { type: TopologyType; label: string; icon: string }[] = [
    { type: 'master', label: 'Triple Play', icon: '🌐' },
    { type: 'internet', label: 'Internet', icon: '🔵' },
    { type: 'iptv', label: 'IPTV', icon: '🟢' },
    { type: 'voip', label: 'VoIP', icon: '🟠' },
  ];
  
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
      
      {/* Header */}
      <header className="pt-20 pb-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Network Topology
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Carrier-grade ISP architecture for Triple Play services
          </p>
        </div>
      </header>
      
      {/* Service Tabs */}
      <nav className="px-6 pb-6">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
          {tabs.map(({ type, label, icon }) => {
            const topo = topologies[type];
            const isActive = activeTopology === type;
            
            return (
              <button
                key={type}
                onClick={() => setActiveTopology(type)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive 
                    ? `bg-linear-to-r ${topo.color} text-white shadow-lg scale-105` 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopology}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-5 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${currentData.color} flex items-center justify-center shrink-0`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      {currentData.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {currentData.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Diagram */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 overflow-hidden">
                <TopologyDiagram data={currentData} isDark={isDark} />
              </div>
              
              {/* Legend */}
              <div className="mt-5 grid md:grid-cols-2 gap-4">
                {/* Node Types */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Node Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'subscriber', label: 'Subscriber' },
                      { type: 'access', label: 'Access' },
                      { type: 'aggregation', label: 'Aggregation' },
                      { type: 'core', label: 'Core' },
                      { type: 'server', label: 'Server' },
                      { type: 'external', label: 'External' },
                    ].map(({ type, label }) => {
                      const styles = nodeTypeStyles[type as TopologyNode['type']];
                      return (
                        <div key={type} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-4 rounded border-2"
                            style={{ 
                              backgroundColor: isDark ? styles.darkFill : styles.fill,
                              borderColor: isDark ? styles.darkStroke : styles.stroke,
                              borderStyle: type === 'external' ? 'dashed' : 'solid'
                            }}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Service Colors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Service Colors & VLANs</h3>
                  <div className="space-y-2">
                    {[
                      { service: 'internet', label: 'Internet', vlan: 'VLAN 100' },
                      { service: 'iptv', label: 'IPTV', vlan: 'VLAN 200' },
                      { service: 'voip', label: 'VoIP', vlan: 'VLAN 300' },
                    ].map(({ service, label, vlan }) => (
                      <div key={service} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-5 h-3 rounded"
                            style={{ backgroundColor: serviceColors[service as keyof typeof serviceColors].main }}
                          />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">{vlan}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <div className="w-5 h-3 rounded border-2 border-dashed border-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">HA Pair (Active/Standby)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
