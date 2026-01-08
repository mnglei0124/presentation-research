'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type TopologyType = 'master' | 'enterprise' | 'home' | 'iptv' | 'voip';

interface TopologyNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'subscriber' | 'access' | 'gpon' | 'core' | 'server' | 'cloud';
  description?: string;
  ha?: boolean;
  vlan?: string;
  layer?: 'access' | 'gpon' | 'core';
}

interface TopologyConnection {
  from: string;
  to: string;
  service?: 'enterprise' | 'home' | 'iptv' | 'voip' | 'all';
  style?: 'solid' | 'dashed' | 'multicast';
  label?: string;
  castType?: 'unicast' | 'multicast';
}

interface TopologyData {
  title: string;
  description: string;
  color: string;
  viewBox: string;
  nodes: TopologyNode[];
  connections: TopologyConnection[];
  vlanInfo: {
    preConversion: string;
    postConversion: string;
  };
}

// Service colors
const serviceColors = {
  master: { main: '#8b5cf6', light: '#c4b5fd', dark: '#6d28d9', bg: '#f5f3ff' },
  enterprise: { main: '#3b82f6', light: '#93c5fd', dark: '#1d4ed8', bg: '#eff6ff' },
  home: { main: '#06b6d4', light: '#67e8f9', dark: '#0891b2', bg: '#ecfeff' },
  iptv: { main: '#22c55e', light: '#86efac', dark: '#15803d', bg: '#f0fdf4' },
  voip: { main: '#f97316', light: '#fdba74', dark: '#c2410c', bg: '#fff7ed' },
};

// Layer colors (for background highlighting)
const layerColors = {
  access: { light: 'rgba(251, 191, 36, 0.08)', dark: 'rgba(251, 191, 36, 0.15)', border: '#fbbf24', label: 'Access Network' },
  gpon: { light: 'rgba(59, 130, 246, 0.08)', dark: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', label: 'GPON' },
  core: { light: 'rgba(168, 85, 247, 0.08)', dark: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', label: 'Core Fixed Network' },
};

// Enterprise Internet topology
const enterpriseTopology: TopologyData = {
  title: 'Enterprise Internet',
  description: 'Dedicated business connectivity via MDU using BRAS1/BRAS2',
  color: 'from-blue-500 to-indigo-600',
  viewBox: '0 0 1200 900',
  vlanInfo: {
    preConversion: '963 (Internet)',
    postConversion: '3700-3899',
  },
  nodes: [
    // Layer 1: Access Network (bottom) - y: 800
    { id: 'enterprise', label: 'Enterprise Internet', x: 550, y: 820, type: 'subscriber', description: 'Business Customer', layer: 'access' },
    
    // Layer 2: GPON - y: 650-700
    { id: 'mdu', label: 'MDU', x: 550, y: 680, type: 'access', description: 'Multi-Dwelling Unit', layer: 'gpon' },
    { id: 'splitter', label: 'Splitter', x: 550, y: 580, type: 'gpon', description: '1:32 Passive', layer: 'gpon' },
    { id: 'olt', label: 'OLT', x: 550, y: 480, type: 'gpon', description: 'GPON Head-end', layer: 'gpon' },
    
    // Layer 3: Core Fixed Network - y: 100-400
    { id: 'metro', label: 'Metro Cluster', x: 550, y: 380, type: 'core', description: 'Aggregation', ha: true, layer: 'core' },
    { id: 'bras1', label: 'BRAS1', x: 450, y: 280, type: 'core', description: 'Active', layer: 'core' },
    { id: 'bras2', label: 'BRAS2', x: 650, y: 280, type: 'core', description: 'Standby', layer: 'core' },
    { id: 'hcore1', label: 'HCORE1', x: 400, y: 180, type: 'core', layer: 'core' },
    { id: 'hcore2', label: 'HCORE2', x: 700, y: 180, type: 'core', layer: 'core' },
    { id: 'sig', label: 'SIG', x: 550, y: 100, type: 'core', description: 'NAT/Security', layer: 'core' },
    
    // External/Cloud - y: 20
    { id: 'igw1', label: 'IGW1', x: 380, y: 20, type: 'cloud', layer: 'core' },
    { id: 'igw2', label: 'IGW2', x: 550, y: 20, type: 'cloud', layer: 'core' },
    { id: 'public', label: 'Public Internet', x: 380, y: -60, type: 'cloud', description: 'Internet' },
    { id: 'mix', label: 'MIX', x: 550, y: -60, type: 'cloud', description: 'Mongolian IXP' },
    
    // CDN Branch
    { id: 'hcdn', label: 'HCDN Cluster', x: 850, y: 100, type: 'server', layer: 'core' },
    { id: 'cdn', label: 'CDN Network', x: 1000, y: 100, type: 'cloud' },
    
    // DNS Branch
    { id: 'intswitch', label: 'Internet Switch', x: 200, y: 100, type: 'core', layer: 'core' },
    { id: 'dns', label: 'DNS', x: 50, y: 100, type: 'server' },
    
    // RADIUS Branch (DC_M7K)
    { id: 'dcm7k', label: 'DC_M7K Switch', x: 550, y: 200, type: 'core', layer: 'core' },
    { id: 'radius_cpar', label: 'RADIUS (CPAR)', x: 550, y: 280, type: 'server' },
    { id: 'radius_db', label: 'RADIUS DB', x: 700, y: 280, type: 'server' },
    
    // SIG DB
    { id: 'sig_db', label: 'SIG DB', x: 700, y: 100, type: 'server' },
  ],
  connections: [
    // Main path - bottom to top
    { from: 'enterprise', to: 'mdu', service: 'enterprise', label: 'VLAN 963' },
    { from: 'mdu', to: 'splitter', service: 'enterprise', label: 'VLAN 3700-3899' },
    { from: 'splitter', to: 'olt', service: 'enterprise' },
    { from: 'olt', to: 'metro', service: 'enterprise' },
    { from: 'metro', to: 'bras1', service: 'enterprise' },
    { from: 'metro', to: 'bras2', service: 'enterprise', style: 'dashed' },
    
    // BRAS to HCORE
    { from: 'bras1', to: 'hcore1', service: 'enterprise' },
    { from: 'bras2', to: 'hcore2', service: 'enterprise' },
    
    // HCORE to SIG
    { from: 'hcore1', to: 'sig', service: 'enterprise' },
    { from: 'hcore2', to: 'sig', service: 'enterprise' },
    
    // SIG to IGW
    { from: 'sig', to: 'igw1', service: 'enterprise' },
    { from: 'sig', to: 'igw2', service: 'enterprise' },
    { from: 'igw1', to: 'public', service: 'enterprise' },
    { from: 'igw2', to: 'mix', service: 'enterprise' },
    
    // CDN path
    { from: 'hcore1', to: 'hcdn', service: 'enterprise' },
    { from: 'hcore2', to: 'hcdn', service: 'enterprise' },
    { from: 'hcdn', to: 'cdn', service: 'enterprise' },
    
    // DNS path
    { from: 'hcore1', to: 'intswitch', service: 'enterprise' },
    { from: 'hcore2', to: 'intswitch', service: 'enterprise' },
    { from: 'intswitch', to: 'dns', service: 'enterprise' },
    
    // RADIUS path (DC_M7K)
    { from: 'bras1', to: 'dcm7k', service: 'enterprise' },
    { from: 'bras2', to: 'dcm7k', service: 'enterprise' },
    { from: 'dcm7k', to: 'radius_cpar', service: 'enterprise' },
    { from: 'radius_cpar', to: 'radius_db', service: 'enterprise' },
    
    // SIG DB
    { from: 'sig', to: 'sig_db', service: 'enterprise' },
  ],
};

// Home Internet topology
const homeTopology: TopologyData = {
  title: 'Home Internet',
  description: 'Residential connectivity via Home Gateway + MDU/ONT using BRAS3/BRAS4',
  color: 'from-cyan-500 to-teal-500',
  viewBox: '0 0 1200 900',
  vlanInfo: {
    preConversion: '963 (Internet)',
    postConversion: '3700-3899',
  },
  nodes: [
    // Layer 1: Access Network (bottom) - y: 800-750
    { id: 'internet', label: 'Internet Service', x: 550, y: 820, type: 'subscriber', description: 'Home User', layer: 'access' },
    { id: 'hg', label: 'Home Gateway', x: 400, y: 720, type: 'subscriber', description: 'CPE', layer: 'access' },
    
    // Layer 2: GPON - y: 600-500
    { id: 'mdu', label: 'MDU', x: 350, y: 620, type: 'access', layer: 'gpon' },
    { id: 'ont', label: 'ONT', x: 550, y: 620, type: 'access', layer: 'gpon' },
    { id: 'splitter', label: 'Splitter', x: 450, y: 520, type: 'gpon', description: '1:32 Passive', layer: 'gpon' },
    { id: 'olt', label: 'OLT', x: 450, y: 420, type: 'gpon', description: 'GPON Head-end', layer: 'gpon' },
    
    // Layer 3: Core Fixed Network - y: 100-350
    { id: 'metro', label: 'Metro Cluster', x: 450, y: 320, type: 'core', ha: true, layer: 'core' },
    { id: 'bras3', label: 'BRAS3', x: 350, y: 220, type: 'core', description: 'Active', layer: 'core' },
    { id: 'bras4', label: 'BRAS4', x: 550, y: 220, type: 'core', description: 'Standby', layer: 'core' },
    { id: 'hcore1', label: 'HCORE1', x: 300, y: 120, type: 'core', layer: 'core' },
    { id: 'hcore2', label: 'HCORE2', x: 600, y: 120, type: 'core', layer: 'core' },
    { id: 'sig', label: 'SIG', x: 450, y: 40, type: 'core', description: 'NAT/Security', layer: 'core' },
    
    // External/Cloud
    { id: 'igw1', label: 'IGW1', x: 300, y: -40, type: 'cloud' },
    { id: 'igw2', label: 'IGW2', x: 450, y: -40, type: 'cloud' },
    { id: 'public', label: 'Public Internet', x: 300, y: -120, type: 'cloud' },
    { id: 'mix', label: 'MIX', x: 450, y: -120, type: 'cloud' },
    
    // CDN Branch
    { id: 'hcdn', label: 'HCDN Cluster', x: 750, y: 40, type: 'server', layer: 'core' },
    { id: 'cdn', label: 'CDN Network', x: 900, y: 40, type: 'cloud' },
    
    // DNS Branch
    { id: 'intswitch', label: 'Internet Switch', x: 150, y: 40, type: 'core', layer: 'core' },
    { id: 'dns', label: 'DNS', x: 20, y: 40, type: 'server' },
    
    // RADIUS Branch (System Switch + Radiator)
    { id: 'sysswitch', label: 'System Switch', x: 750, y: 220, type: 'core', layer: 'core' },
    { id: 'radius_radiator', label: 'RADIUS (Radiator)', x: 900, y: 220, type: 'server' },
    { id: 'radius_db', label: 'RADIUS DB', x: 1050, y: 220, type: 'server' },
  ],
  connections: [
    // Main paths - two entry points
    { from: 'internet', to: 'hg', service: 'home', label: 'VLAN 963' },
    { from: 'hg', to: 'mdu', service: 'home' },
    { from: 'internet', to: 'ont', service: 'home', label: 'VLAN 963' },
    { from: 'mdu', to: 'splitter', service: 'home', label: 'VLAN 3700-3899' },
    { from: 'ont', to: 'splitter', service: 'home', label: 'VLAN 3700-3899' },
    { from: 'splitter', to: 'olt', service: 'home' },
    { from: 'olt', to: 'metro', service: 'home' },
    { from: 'metro', to: 'bras3', service: 'home' },
    { from: 'metro', to: 'bras4', service: 'home', style: 'dashed' },
    
    // BRAS to HCORE
    { from: 'bras3', to: 'hcore1', service: 'home' },
    { from: 'bras4', to: 'hcore2', service: 'home' },
    
    // HCORE to SIG
    { from: 'hcore1', to: 'sig', service: 'home' },
    { from: 'hcore2', to: 'sig', service: 'home' },
    
    // SIG to IGW
    { from: 'sig', to: 'igw1', service: 'home' },
    { from: 'sig', to: 'igw2', service: 'home' },
    { from: 'igw1', to: 'public', service: 'home' },
    { from: 'igw2', to: 'mix', service: 'home' },
    
    // CDN path
    { from: 'hcore1', to: 'hcdn', service: 'home' },
    { from: 'hcore2', to: 'hcdn', service: 'home' },
    { from: 'hcdn', to: 'cdn', service: 'home' },
    
    // DNS path
    { from: 'hcore1', to: 'intswitch', service: 'home' },
    { from: 'hcore2', to: 'intswitch', service: 'home' },
    { from: 'intswitch', to: 'dns', service: 'home' },
    
    // RADIUS path (System Switch + Radiator)
    { from: 'bras3', to: 'sysswitch', service: 'home' },
    { from: 'bras4', to: 'sysswitch', service: 'home' },
    { from: 'sysswitch', to: 'radius_radiator', service: 'home' },
    { from: 'radius_radiator', to: 'radius_db', service: 'home' },
  ],
};

// IPTV topology
const iptvTopology: TopologyData = {
  title: 'IPTV Service',
  description: 'Live TV (Multicast) and VOD (Unicast) via SPINE switch',
  color: 'from-green-500 to-emerald-500',
  viewBox: '0 0 1000 900',
  vlanInfo: {
    preConversion: '962 (IPTV)',
    postConversion: '800-999 (962 for multicast)',
  },
  nodes: [
    // Layer 1: Access Network (bottom)
    { id: 'iptv', label: 'IPTV Service', x: 450, y: 820, type: 'subscriber', layer: 'access' },
    { id: 'hg', label: 'Home Gateway', x: 350, y: 720, type: 'subscriber', description: 'CPE', layer: 'access' },
    
    // Layer 2: GPON
    { id: 'mdu', label: 'MDU', x: 300, y: 620, type: 'access', layer: 'gpon' },
    { id: 'ont', label: 'ONT', x: 500, y: 620, type: 'access', layer: 'gpon' },
    { id: 'splitter', label: 'Splitter', x: 400, y: 520, type: 'gpon', description: '1:32 Passive', layer: 'gpon' },
    { id: 'olt', label: 'OLT', x: 400, y: 420, type: 'gpon', description: 'Multicast Replication', layer: 'gpon' },
    
    // Layer 3: Core Fixed Network
    { id: 'metro', label: 'Metro Cluster', x: 400, y: 320, type: 'core', ha: true, layer: 'core' },
    { id: 'spine', label: 'SPINE', x: 400, y: 200, type: 'core', description: 'IGMP Proxy', layer: 'core' },
    
    // Services at top
    { id: 'livetv', label: 'Live TV', x: 200, y: 80, type: 'server', description: 'Multicast Streams' },
    { id: 'vod', label: 'VOD', x: 350, y: 80, type: 'server', description: 'Unicast' },
    { id: 'dhcp', label: 'DHCP', x: 500, y: 80, type: 'server' },
    { id: 'dns', label: 'DNS', x: 650, y: 80, type: 'server' },
  ],
  connections: [
    // Main paths
    { from: 'iptv', to: 'hg', service: 'iptv', label: 'VLAN 962' },
    { from: 'hg', to: 'mdu', service: 'iptv' },
    { from: 'iptv', to: 'ont', service: 'iptv', label: 'VLAN 962' },
    { from: 'mdu', to: 'splitter', service: 'iptv' },
    { from: 'ont', to: 'splitter', service: 'iptv' },
    { from: 'splitter', to: 'olt', service: 'iptv' },
    { from: 'olt', to: 'metro', service: 'iptv' },
    { from: 'metro', to: 'spine', service: 'iptv' },
    
    // Content sources
    { from: 'spine', to: 'livetv', service: 'iptv', style: 'multicast', label: 'Multicast', castType: 'multicast' },
    { from: 'spine', to: 'vod', service: 'iptv', label: 'Unicast', castType: 'unicast' },
    { from: 'spine', to: 'dhcp', service: 'iptv' },
    { from: 'spine', to: 'dns', service: 'iptv' },
  ],
};

// VoIP topology
const voipTopology: TopologyData = {
  title: 'VoIP Service',
  description: 'Voice over IP via BRAS1/BRAS2 to Voice Core',
  color: 'from-orange-500 to-red-500',
  viewBox: '0 0 1000 900',
  vlanInfo: {
    preConversion: '961 (TR-069/Voice)',
    postConversion: '700-799',
  },
  nodes: [
    // Layer 1: Access Network (bottom)
    { id: 'voip', label: 'VoIP Service', x: 450, y: 820, type: 'subscriber', layer: 'access' },
    { id: 'hg', label: 'Home Gateway', x: 350, y: 720, type: 'subscriber', description: 'SIP ATA', layer: 'access' },
    
    // Layer 2: GPON
    { id: 'mdu', label: 'MDU', x: 300, y: 620, type: 'access', layer: 'gpon' },
    { id: 'ont', label: 'ONT', x: 500, y: 620, type: 'access', layer: 'gpon' },
    { id: 'splitter', label: 'Splitter', x: 400, y: 520, type: 'gpon', description: '1:32 Passive', layer: 'gpon' },
    { id: 'olt', label: 'OLT', x: 400, y: 420, type: 'gpon', layer: 'gpon' },
    
    // Layer 3: Core Fixed Network
    { id: 'metro', label: 'Metro Cluster', x: 400, y: 320, type: 'core', ha: true, layer: 'core' },
    { id: 'bras1', label: 'BRAS1', x: 300, y: 220, type: 'core', layer: 'core' },
    { id: 'bras2', label: 'BRAS2', x: 500, y: 220, type: 'core', layer: 'core' },
    
    // Voice Core (cloud)
    { id: 'voicecore', label: 'Voice Core', x: 400, y: 100, type: 'cloud', description: 'SIP/RTP' },
    
    // System Switch + DHCP
    { id: 'sysswitch', label: 'System Switch', x: 700, y: 220, type: 'core', layer: 'core' },
    { id: 'dhcp', label: 'DHCP', x: 850, y: 220, type: 'server', description: 'VoIP Only' },
  ],
  connections: [
    // Main paths
    { from: 'voip', to: 'hg', service: 'voip', label: 'VLAN 961' },
    { from: 'hg', to: 'mdu', service: 'voip' },
    { from: 'voip', to: 'ont', service: 'voip', label: 'VLAN 961' },
    { from: 'mdu', to: 'splitter', service: 'voip', label: 'VLAN 700-799' },
    { from: 'ont', to: 'splitter', service: 'voip', label: 'VLAN 700-799' },
    { from: 'splitter', to: 'olt', service: 'voip' },
    { from: 'olt', to: 'metro', service: 'voip' },
    { from: 'metro', to: 'bras1', service: 'voip' },
    { from: 'metro', to: 'bras2', service: 'voip', style: 'dashed' },
    
    // Voice Core
    { from: 'bras1', to: 'voicecore', service: 'voip', label: 'SIP' },
    { from: 'bras2', to: 'voicecore', service: 'voip', label: 'SIP' },
    
    // DHCP path
    { from: 'bras1', to: 'sysswitch', service: 'voip' },
    { from: 'bras2', to: 'sysswitch', service: 'voip' },
    { from: 'sysswitch', to: 'dhcp', service: 'voip' },
  ],
};

// Master Triple Play topology - all services combined
const masterTopology: TopologyData = {
  title: 'Triple Play Architecture',
  description: 'Complete view: Enterprise Internet, Home Internet, IPTV, and VoIP',
  color: 'from-violet-500 to-purple-600',
  viewBox: '0 0 1200 1200',
  vlanInfo: {
    preConversion: '961 (Voice), 962 (IPTV), 963 (Internet)',
    postConversion: '700-799 (VoIP), 800-999 (IPTV), 3700-3899 (Internet)',
  },
  nodes: [
    // Layer 1: Access Network (bottom) - y: 1100-1000
    { id: 'enterprise', label: 'Enterprise', x: 150, y: 1100, type: 'subscriber', description: 'Enterprise Internet', layer: 'access' },
    { id: 'home_internet', label: 'Home Internet', x: 350, y: 1100, type: 'subscriber', description: 'Residential', layer: 'access' },
    { id: 'iptv_svc', label: 'IPTV', x: 550, y: 1100, type: 'subscriber', description: 'TV Service', layer: 'access' },
    { id: 'voip_svc', label: 'VoIP', x: 750, y: 1100, type: 'subscriber', description: 'Voice', layer: 'access' },
    
    { id: 'hg', label: 'Home Gateway', x: 450, y: 980, type: 'subscriber', description: 'CPE', layer: 'access' },
    
    // Layer 2: GPON - y: 850-700
    { id: 'mdu', label: 'MDU', x: 350, y: 850, type: 'access', layer: 'gpon' },
    { id: 'ont', label: 'ONT', x: 600, y: 850, type: 'access', layer: 'gpon' },
    { id: 'splitter', label: 'Splitter', x: 475, y: 750, type: 'gpon', description: '1:32 Passive', layer: 'gpon' },
    { id: 'olt', label: 'OLT', x: 475, y: 650, type: 'gpon', description: 'GPON Head-end', layer: 'gpon' },
    
    // Layer 3: Core Fixed Network - y: 550-100
    { id: 'metro', label: 'Metro Cluster', x: 475, y: 550, type: 'core', ha: true, layer: 'core' },
    
    // BRAS cluster
    { id: 'bras1', label: 'BRAS1', x: 200, y: 450, type: 'core', description: 'Enterprise/VoIP', layer: 'core' },
    { id: 'bras2', label: 'BRAS2', x: 350, y: 450, type: 'core', description: 'Enterprise/VoIP', layer: 'core' },
    { id: 'bras3', label: 'BRAS3', x: 550, y: 450, type: 'core', description: 'Home Internet', layer: 'core' },
    { id: 'bras4', label: 'BRAS4', x: 700, y: 450, type: 'core', description: 'Home Internet', layer: 'core' },
    
    // SPINE for IPTV
    { id: 'spine', label: 'SPINE', x: 900, y: 450, type: 'core', description: 'IPTV Only', layer: 'core' },
    
    // HCORE
    { id: 'hcore1', label: 'HCORE1', x: 350, y: 350, type: 'core', layer: 'core' },
    { id: 'hcore2', label: 'HCORE2', x: 550, y: 350, type: 'core', layer: 'core' },
    
    // SIG and external
    { id: 'sig', label: 'SIG', x: 450, y: 250, type: 'core', description: 'NAT/Security', layer: 'core' },
    { id: 'igw1', label: 'IGW1', x: 350, y: 150, type: 'core', description: 'Internet Gateway', layer: 'core' },
    { id: 'igw2', label: 'IGW2', x: 500, y: 150, type: 'core', description: 'Internet Gateway', layer: 'core' },
    { id: 'public', label: 'Public/MIX', x: 430, y: 50, type: 'cloud' },
    
    // CDN
    { id: 'hcdn', label: 'HCDN', x: 700, y: 250, type: 'server', layer: 'core' },
    { id: 'cdn', label: 'CDN Network', x: 850, y: 250, type: 'cloud' },
    
    // Voice Core
    { id: 'voicecore', label: 'Voice Core', x: 100, y: 350, type: 'cloud', description: 'SIP/RTP' },
    
    // IPTV services
    { id: 'livetv', label: 'Live TV', x: 850, y: 350, type: 'server', description: 'Multicast', layer: 'core' },
    { id: 'vod', label: 'VOD', x: 1000, y: 350, type: 'server', description: 'Unicast', layer: 'core' },
    { id: 'iptv_dhcp', label: 'DHCP', x: 1000, y: 450, type: 'server', layer: 'core' },
    { id: 'iptv_dns', label: 'DNS', x: 1100, y: 450, type: 'server', layer: 'core' },
    
    // Internet services
    { id: 'intswitch', label: 'Internet Switch', x: 150, y: 250, type: 'core', layer: 'core' },
    { id: 'dns', label: 'DNS', x: 50, y: 250, type: 'server', layer: 'core' },
    
    // RADIUS
    { id: 'dcm7k', label: 'DC_M7K', x: 200, y: 530, type: 'core', layer: 'core' },
    { id: 'sysswitch', label: 'System Switch', x: 750, y: 530, type: 'core', layer: 'core' },
    { id: 'radius_cpar', label: 'RADIUS (CPAR)', x: 50, y: 530, type: 'server', layer: 'core' },
    { id: 'radius_radiator', label: 'RADIUS (Radiator)', x: 900, y: 530, type: 'server', layer: 'core' },
    { id: 'voip_dhcp', label: 'DHCP (VoIP)', x: 1050, y: 530, type: 'server', layer: 'core' },
  ],
  connections: [
    // Enterprise path (blue)
    { from: 'enterprise', to: 'mdu', service: 'enterprise', label: 'VLAN 963' },
    { from: 'mdu', to: 'splitter', service: 'enterprise' },
    
    // Home Internet path (cyan) 
    { from: 'home_internet', to: 'hg', service: 'home', label: 'VLAN 963' },
    { from: 'hg', to: 'mdu', service: 'home' },
    { from: 'hg', to: 'ont', service: 'home' },
    { from: 'ont', to: 'splitter', service: 'home' },
    
    // IPTV path (green)
    { from: 'iptv_svc', to: 'hg', service: 'iptv', label: 'VLAN 962' },
    
    // VoIP path (orange)
    { from: 'voip_svc', to: 'hg', service: 'voip', label: 'VLAN 961' },
    
    // Common GPON path
    { from: 'splitter', to: 'olt', service: 'all' },
    { from: 'olt', to: 'metro', service: 'all' },
    
    // Metro to BRAS/SPINE
    { from: 'metro', to: 'bras1', service: 'enterprise' },
    { from: 'metro', to: 'bras2', service: 'enterprise', style: 'dashed' },
    { from: 'metro', to: 'bras3', service: 'home' },
    { from: 'metro', to: 'bras4', service: 'home', style: 'dashed' },
    { from: 'metro', to: 'spine', service: 'iptv' },
    
    // VoIP also uses BRAS1/2
    { from: 'bras1', to: 'voicecore', service: 'voip' },
    { from: 'bras2', to: 'voicecore', service: 'voip' },
    
    // BRAS to HCORE
    { from: 'bras1', to: 'hcore1', service: 'enterprise' },
    { from: 'bras2', to: 'hcore2', service: 'enterprise' },
    { from: 'bras3', to: 'hcore1', service: 'home' },
    { from: 'bras4', to: 'hcore2', service: 'home' },
    
    // HCORE to SIG
    { from: 'hcore1', to: 'sig', service: 'all' },
    { from: 'hcore2', to: 'sig', service: 'all' },
    
    // SIG to IGW
    { from: 'sig', to: 'igw1', service: 'all' },
    { from: 'sig', to: 'igw2', service: 'all' },
    { from: 'igw1', to: 'public', service: 'all' },
    { from: 'igw2', to: 'public', service: 'all' },
    
    // CDN
    { from: 'hcore1', to: 'hcdn', service: 'all' },
    { from: 'hcore2', to: 'hcdn', service: 'all' },
    { from: 'hcdn', to: 'cdn', service: 'all' },
    
    // DNS
    { from: 'hcore1', to: 'intswitch', service: 'all' },
    { from: 'intswitch', to: 'dns', service: 'all' },
    
    // SPINE to IPTV services
    { from: 'spine', to: 'livetv', service: 'iptv', style: 'multicast', castType: 'multicast' },
    { from: 'spine', to: 'vod', service: 'iptv', castType: 'unicast' },
    { from: 'spine', to: 'iptv_dhcp', service: 'iptv' },
    { from: 'spine', to: 'iptv_dns', service: 'iptv' },
    
    // RADIUS paths
    { from: 'bras1', to: 'dcm7k', service: 'enterprise' },
    { from: 'bras2', to: 'dcm7k', service: 'enterprise' },
    { from: 'dcm7k', to: 'radius_cpar', service: 'enterprise' },
    { from: 'bras3', to: 'sysswitch', service: 'home' },
    { from: 'bras4', to: 'sysswitch', service: 'home' },
    { from: 'sysswitch', to: 'radius_radiator', service: 'home' },
    { from: 'sysswitch', to: 'voip_dhcp', service: 'voip' },
  ],
};

const topologies: Record<TopologyType, TopologyData> = {
  master: masterTopology,
  enterprise: enterpriseTopology,
  home: homeTopology,
  iptv: iptvTopology,
  voip: voipTopology,
};

const nodeTypeStyles: Record<TopologyNode['type'], { fill: string; stroke: string; darkFill: string; darkStroke: string }> = {
  subscriber: { fill: '#fef3c7', stroke: '#f59e0b', darkFill: '#78350f', darkStroke: '#fbbf24' },
  access: { fill: '#dbeafe', stroke: '#3b82f6', darkFill: '#1e3a8a', darkStroke: '#60a5fa' },
  gpon: { fill: '#e0f2fe', stroke: '#0ea5e9', darkFill: '#0c4a6e', darkStroke: '#38bdf8' },
  core: { fill: '#f3e8ff', stroke: '#a855f7', darkFill: '#4c1d95', darkStroke: '#c084fc' },
  server: { fill: '#d1fae5', stroke: '#10b981', darkFill: '#064e3b', darkStroke: '#34d399' },
  cloud: { fill: '#fce7f3', stroke: '#ec4899', darkFill: '#831843', darkStroke: '#f472b6' },
};

// Cloud shape path generator
function getCloudPath(x: number, y: number, width: number, height: number): string {
  const w = width;
  const h = height;
  return `
    M ${x + w * 0.2} ${y + h * 0.7}
    C ${x} ${y + h * 0.7}, ${x} ${y + h * 0.3}, ${x + w * 0.2} ${y + h * 0.3}
    C ${x + w * 0.15} ${y}, ${x + w * 0.4} ${y}, ${x + w * 0.5} ${y + h * 0.2}
    C ${x + w * 0.6} ${y}, ${x + w * 0.85} ${y}, ${x + w * 0.8} ${y + h * 0.3}
    C ${x + w} ${y + h * 0.3}, ${x + w} ${y + h * 0.7}, ${x + w * 0.8} ${y + h * 0.7}
    Z
  `;
}

function TopologyDiagram({ data, isDark, serviceType }: { data: TopologyData; isDark: boolean; serviceType: TopologyType }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const getNode = (id: string) => data.nodes.find(n => n.id === id);
  
  const getServiceColor = (connService?: string) => {
    // In master view, use per-connection service colors
    if (serviceType === 'master' && connService && connService !== 'all') {
      return serviceColors[connService as keyof typeof serviceColors]?.main || '#8b5cf6';
    }
    // In master view with 'all' service, use purple
    if (serviceType === 'master') {
      return '#8b5cf6';
    }
    return serviceColors[serviceType]?.main || '#6b7280';
  };
  
  const getPath = (from: TopologyNode, to: TopologyNode) => {
    const width = 100;
    const x1 = from.x + width / 2;
    const y1 = from.y;
    const x2 = to.x + width / 2;
    const y2 = to.y + 48;
    
    // Vertical path with curve
    const dy = y1 - y2;
    const cy1 = y1 - dy * 0.3;
    const cy2 = y2 + dy * 0.3;
    
    return `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
  };
  
  // Calculate layer boundaries with uniform width
  const getAllLayerNodes = () => {
    return data.nodes.filter(n => n.layer);
  };
  
  const getLayerBounds = (layer: 'access' | 'gpon' | 'core') => {
    const layerNodes = data.nodes.filter(n => n.layer === layer);
    if (layerNodes.length === 0) return null;
    
    const allLayerNodes = getAllLayerNodes();
    
    // Calculate global min/max X across all layers for uniform width
    const globalMinX = Math.min(...allLayerNodes.map(n => n.x)) - 30;
    const globalMaxX = Math.max(...allLayerNodes.map(n => n.x)) + 150;
    
    // Calculate Y bounds for this specific layer
    const minY = Math.min(...layerNodes.map(n => n.y)) - 30;
    const maxY = Math.max(...layerNodes.map(n => n.y)) + 70;
    
    return { x: globalMinX, y: minY, width: globalMaxX - globalMinX, height: maxY - minY };
  };
  
  return (
    <div className="relative w-full overflow-x-auto">
      <svg 
        viewBox={data.viewBox}
        className="w-full h-auto"
        style={{ minHeight: '500px' }}
      >
        <defs>
          {/* Arrow markers for each service */}
          {(['master', 'enterprise', 'home', 'iptv', 'voip'] as const).map(service => (
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
                fill={serviceColors[service]?.main || '#8b5cf6'} 
              />
            </marker>
          ))}
          <marker
            id="arrow-multicast"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 4, 0 8" 
              fill="#22c55e" 
            />
          </marker>
          <marker id="arrow-highlight" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
          </marker>
        </defs>
        
        {/* Layer backgrounds */}
        {(['access', 'gpon', 'core'] as const).map(layer => {
          const bounds = getLayerBounds(layer);
          if (!bounds) return null;
          const colors = layerColors[layer];
          
          return (
            <g key={layer}>
              <rect
                x={bounds.x}
                y={bounds.y}
                width={bounds.width}
                height={bounds.height}
                rx={16}
                fill={isDark ? colors.dark : colors.light}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="8,4"
                opacity={0.8}
              />
              <text
                x={bounds.x + 10}
                y={bounds.y + 20}
                fill={colors.border}
                className="text-xs font-semibold"
                opacity={0.9}
              >
                {colors.label}
              </text>
            </g>
          );
        })}
        
        {/* Connections */}
        {data.connections.map((conn, i) => {
          const from = getNode(conn.from);
          const to = getNode(conn.to);
          if (!from || !to) return null;
          
          const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
          const connServiceKey = conn.service || 'all';
          const color = isHighlighted ? '#8b5cf6' : getServiceColor(connServiceKey);
          const arrowService = serviceType === 'master' ? (connServiceKey !== 'all' ? connServiceKey : 'master') : serviceType;
          const markerId = conn.style === 'multicast' ? 'arrow-multicast' : (isHighlighted ? 'arrow-highlight' : `arrow-${arrowService}`);
          
          return (
            <g key={i}>
              <path
                d={getPath(from, to)}
                stroke={conn.style === 'multicast' ? '#22c55e' : color}
                strokeWidth={isHighlighted ? 3 : (conn.style === 'multicast' ? 3 : 2)}
                strokeDasharray={conn.style === 'dashed' ? '6,4' : (conn.style === 'multicast' ? '2,2' : undefined)}
                fill="none"
                markerEnd={`url(#${markerId})`}
                className="transition-all duration-200"
              />
              {conn.label && (
                <text
                  x={(from.x + to.x) / 2 + 60}
                  y={(from.y + to.y) / 2}
                  fill={conn.castType === 'multicast' ? '#22c55e' : (isDark ? '#d1d5db' : '#4b5563')}
                  className="text-[10px] font-medium"
                  textAnchor="middle"
                >
                  {conn.label}
                </text>
              )}
              {conn.castType && (
                <text
                  x={(from.x + to.x) / 2 + 60}
                  y={(from.y + to.y) / 2 + 12}
                  fill={conn.castType === 'multicast' ? '#16a34a' : '#6b7280'}
                  className="text-[9px] font-bold uppercase"
                  textAnchor="middle"
                >
                  {conn.castType}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Nodes */}
        {data.nodes.map((node) => {
          const styles = nodeTypeStyles[node.type];
          const isHovered = hoveredNode === node.id;
          const width = node.label.length > 12 ? 120 : 100;
          
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
              
              {/* Cloud shape for cloud type nodes */}
              {node.type === 'cloud' ? (
                <path
                  d={getCloudPath(node.x, node.y, width, 48)}
                  fill={isDark ? styles.darkFill : styles.fill}
                  stroke={isHovered ? '#8b5cf6' : (isDark ? styles.darkStroke : styles.stroke)}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ 
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.4))' : undefined,
                    transition: 'all 0.2s ease'
                  }}
                />
              ) : (
                /* Regular node */
                <rect
                  x={node.x}
                  y={node.y}
                  width={width}
                  height={48}
                  rx={10}
                  fill={isDark ? styles.darkFill : styles.fill}
                  stroke={isHovered ? '#8b5cf6' : (isDark ? styles.darkStroke : styles.stroke)}
                  strokeWidth={isHovered ? 3 : 2}
                  style={{ 
                    filter: isHovered ? 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.4))' : undefined,
                    transition: 'all 0.2s ease'
                  }}
                />
              )}
              
              {/* Label */}
              <text
                x={node.x + width / 2}
                y={node.y + 28}
                textAnchor="middle"
                className="text-xs font-semibold pointer-events-none"
                fill={isDark ? (isHovered ? '#fff' : styles.darkStroke) : '#374151'}
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
    { type: 'enterprise', label: 'Enterprise Internet', icon: '🏢' },
    { type: 'home', label: 'Home Internet', icon: '🏠' },
    { type: 'iptv', label: 'IPTV', icon: '📺' },
    { type: 'voip', label: 'VoIP', icon: '📞' },
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
            Carrier-grade ISP architecture • Bottom-to-Top Flow
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
                    ? `bg-gradient-to-r ${topo.color} text-white shadow-lg scale-105` 
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
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentData.color} flex items-center justify-center shrink-0`}>
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
                  
                  {/* VLAN Info */}
                  <div className="flex gap-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                      <span className="text-gray-500 dark:text-gray-400">Pre-MDU/ONT: </span>
                      <span className="font-mono text-gray-900 dark:text-white">{currentData.vlanInfo.preConversion}</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                      <span className="text-gray-500 dark:text-gray-400">Post-MDU/ONT: </span>
                      <span className="font-mono text-gray-900 dark:text-white">{currentData.vlanInfo.postConversion}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Diagram */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 overflow-hidden">
                <TopologyDiagram data={currentData} isDark={isDark} serviceType={activeTopology} />
              </div>
              
              {/* Legend */}
              <div className="mt-5 grid md:grid-cols-3 gap-4">
                {/* Layer Legend */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Network Layers</h3>
                  <div className="space-y-2">
                    {(['access', 'gpon', 'core'] as const).map(layer => {
                      const colors = layerColors[layer];
                      return (
                        <div key={layer} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-4 rounded border-2"
                            style={{ 
                              backgroundColor: isDark ? colors.dark : colors.light,
                              borderColor: colors.border,
                              borderStyle: 'dashed'
                            }}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{colors.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Node Types */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Node Types</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'subscriber', label: 'Subscriber' },
                      { type: 'access', label: 'Access' },
                      { type: 'gpon', label: 'GPON' },
                      { type: 'core', label: 'Core' },
                      { type: 'server', label: 'Server' },
                      { type: 'cloud', label: 'Cloud/External' },
                    ].map(({ type, label }) => {
                      const styles = nodeTypeStyles[type as TopologyNode['type']];
                      return (
                        <div key={type} className="flex items-center gap-2">
                          <div 
                            className="w-6 h-4 rounded border-2"
                            style={{ 
                              backgroundColor: isDark ? styles.darkFill : styles.fill,
                              borderColor: isDark ? styles.darkStroke : styles.stroke,
                            }}
                          />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Connection Types */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Connection Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-current" style={{ backgroundColor: serviceColors[activeTopology].main }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Active Path</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderColor: serviceColors[activeTopology].main }} />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Standby Path</span>
                    </div>
                    {activeTopology === 'iptv' && (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Multicast (IGMP)</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                      <div className="w-5 h-3 rounded border-2 border-dashed border-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">HA Pair</span>
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
