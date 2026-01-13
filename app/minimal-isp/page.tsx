'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Section = 'triple-play' | 'access' | 'gpon' | 'core';

const sections: { id: Section; title: string; color: string }[] = [
  { id: 'triple-play', title: 'Triple Play', color: 'from-violet-500 to-purple-600' },
  { id: 'access', title: 'Access Network', color: 'from-amber-500 to-orange-500' },
  { id: 'gpon', title: 'GPON', color: 'from-blue-500 to-cyan-500' },
  { id: 'core', title: 'Fixed Core', color: 'from-purple-600 to-pink-500' },
];

export default function MinimalISP() {
  const [activeSection, setActiveSection] = useState<Section>('triple-play');

  const scrollToSection = (id: Section) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </Link>
          
          <div className="flex items-center gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? `bg-linear-to-r ${section.color} text-white shadow-lg`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Triple Play Section */}
      <section id="triple-play" className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 mb-4">
                01 — Services
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Triple Play Service
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The convergence of three essential services over a single broadband connection
              </p>
            </div>

            {/* Three Services Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: '🌐', title: 'Internet', desc: 'High-speed broadband for web, downloads, and general connectivity', vlan: 'VLAN 963' },
                { icon: '📺', title: 'IPTV', desc: 'Live TV via multicast, Video-on-Demand via unicast streaming', vlan: 'VLAN 962' },
                { icon: '📞', title: 'VoIP', desc: 'Voice over IP for real-time, low-latency telephone services', vlan: 'VLAN 961' },
              ].map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{service.desc}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {service.vlan}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <Image
                  src="/images/research/triple-play1.png"
                  alt="Triple Play Architecture"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">Triple Play Service Architecture</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <Image
                  src="/images/research/triple-play2.jpeg"
                  alt="Triple Play Convergence"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">Service Convergence Model</p>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-linear-to-r from-violet-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <p className="text-violet-100 leading-relaxed">
                All three services share the same physical fiber connection but are logically separated using VLANs. 
                Each service has dedicated QoS policies ensuring VoIP maintains low latency, IPTV gets priority for smooth video, 
                and Internet traffic flows with best-effort routing. This separation happens at the Home Gateway and is maintained 
                throughout the network to the service platforms.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Access Network Section */}
      <section id="access" className="min-h-screen py-16 px-6 bg-amber-50/50 dark:bg-amber-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4">
                02 — Customer Premises Equipment
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Access Devices
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The devices that connect subscribers to the fiber network
              </p>
            </div>

            {/* Device Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* H101 ONT - Huawei HG8245H5 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-linear-to-br from-blue-500 to-cyan-500 p-6 flex items-center justify-center">
                  <Image
                    src="/images/research/h101 ont.png"
                    alt="H101 ONT"
                    width={200}
                    height={200}
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">ONT</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">HG8245H5</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Huawei GPON ONT</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    GPON ONT for basic FTTH deployments. Terminates fiber signal with Wi-Fi 4 and 4 Ethernet ports. Suitable for homes needing basic connectivity.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Optical Port</span>
                      <span className="font-medium text-gray-900 dark:text-white">SC/APC GPON</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Wi-Fi</span>
                      <span className="font-medium text-gray-900 dark:text-white">802.11b/g/n (2.4GHz)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">MIMO</span>
                      <span className="font-medium text-gray-900 dark:text-white">2×2 MIMO</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Ethernet</span>
                      <span className="font-medium text-gray-900 dark:text-white">4× GE/FE RJ-45</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Voice</span>
                      <span className="font-medium text-gray-900 dark:text-white">2× POTS (RJ-11)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">Management</span>
                      <span className="font-medium text-gray-900 dark:text-white">OMCI, TR-069</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* HG1 Home Gateway - Huawei LG8245X6-10 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-linear-to-br from-purple-500 to-pink-500 p-6 flex items-center justify-center">
                  <Image
                    src="/images/research/hg1 hg.png"
                    alt="HG1 Home Gateway"
                    width={200}
                    height={200}
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Gateway</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">LG8245X6-10</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Huawei Wi-Fi 6 Home Gateway</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Advanced Wi-Fi 6 home gateway with GPON. Features OFDMA, MU-MIMO, and 1024-QAM for high-density homes requiring premium wireless performance.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Wi-Fi</span>
                      <span className="font-medium text-gray-900 dark:text-white">802.11ax (Wi-Fi 6)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Bands</span>
                      <span className="font-medium text-gray-900 dark:text-white">Dual-band 2.4 + 5GHz</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">MIMO</span>
                      <span className="font-medium text-gray-900 dark:text-white">2×2 MU-MIMO</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Ethernet</span>
                      <span className="font-medium text-gray-900 dark:text-white">4× GE LAN + USB 3.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Voice</span>
                      <span className="font-medium text-gray-900 dark:text-white">2× POTS (VoIP)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">Features</span>
                      <span className="font-medium text-gray-900 dark:text-white">OFDMA, TWT, WPA3</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* HG Mesh - TP-Link HX220 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-linear-to-br from-green-500 to-emerald-500 p-6 flex items-center justify-center">
                  <Image
                    src="/images/research/hg mesh.png"
                    alt="HG Mesh"
                    width={200}
                    height={200}
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Mesh System</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">HX220</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">TP-Link Wi-Fi 6 Mesh</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Wi-Fi 6 AX1800 mesh system with EasyMesh support. Dual-band with OFDMA and beamforming for seamless whole-home coverage.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Wi-Fi</span>
                      <span className="font-medium text-gray-900 dark:text-white">802.11ax AX1800</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Speed</span>
                      <span className="font-medium text-gray-900 dark:text-white">574 + 1201 Mbps</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">MIMO</span>
                      <span className="font-medium text-gray-900 dark:text-white">2×2 MU-MIMO</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Ethernet</span>
                      <span className="font-medium text-gray-900 dark:text-white">1× WAN + 2× LAN GE</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Mesh</span>
                      <span className="font-medium text-gray-900 dark:text-white">EasyMesh, Band Steering</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">Features</span>
                      <span className="font-medium text-gray-900 dark:text-white">Beamforming, WPA3</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* HM1 Mesh Satellite - Huawei OptiXstar K562 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="bg-linear-to-br from-orange-500 to-amber-500 p-6 flex items-center justify-center">
                  <Image
                    src="/images/research/hm1 mesh.png"
                    alt="HM1 Mesh Satellite"
                    width={200}
                    height={200}
                    className="h-40 w-auto object-contain"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">Mesh Extender</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">OptiXstar K562</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Huawei Wi-Fi 6 Extender</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    Wi-Fi 6 mesh extender with up to 3 Gbps aggregate throughput. Features 160MHz channels, DL MU-MIMO, and eAI optimization for seamless roaming.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Wi-Fi</span>
                      <span className="font-medium text-gray-900 dark:text-white">802.11ax (~3 Gbps)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Bands</span>
                      <span className="font-medium text-gray-900 dark:text-white">Dual-band 2.4 + 5GHz</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">MIMO</span>
                      <span className="font-medium text-gray-900 dark:text-white">2×2 DL MU-MIMO</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Ethernet</span>
                      <span className="font-medium text-gray-900 dark:text-white">3× GE LAN/Backhaul</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Channel</span>
                      <span className="font-medium text-gray-900 dark:text-white">160MHz supported</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500 dark:text-gray-400">Roaming</span>
                      <span className="font-medium text-gray-900 dark:text-white">802.11k/v, eAI</span>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Wi-Fi Standards Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-linear-to-r from-teal-500 to-cyan-500 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Wi-Fi Standards Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="px-6 py-4 text-left font-medium text-gray-500 dark:text-gray-400"></th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">Wi-Fi 4</th>
                      <th className="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">Wi-Fi 5</th>
                      <th className="px-6 py-4 text-center font-bold text-teal-600 dark:text-teal-400">Wi-Fi 6</th>
                      <th className="px-6 py-4 text-center font-bold text-cyan-600 dark:text-cyan-400">Wi-Fi 6E</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">Release Date</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2009</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2013</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2019</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2021</td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">IEEE Standard</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">802.11n</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">802.11ac</td>
                      <td className="px-6 py-3 text-center text-teal-600 dark:text-teal-400" colSpan={2}>802.11ax</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">Link Rate (Mbit/s)</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">72–600</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">6.5–6933</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400" colSpan={2}>0.4–9608</td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">RF Bands</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2.4 / 5 GHz</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">5 GHz</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">2.4 / 5 GHz</td>
                      <td className="px-6 py-3 text-center text-cyan-600 dark:text-cyan-400 font-medium">6 GHz</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">Modulation</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">64-QAM OFDM</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">256-QAM OFDM</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400" colSpan={2}>1024-QAM OFDMA</td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">Max Data Rate</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">600 Mbps</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">3.5 Gbps</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400" colSpan={2}>9.6 Gbps</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">Channel Size</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">20, 40 MHz</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400" colSpan={3}>20, 40, 80, 80+80, 160 MHz</td>
                    </tr>
                    <tr className="bg-gray-50/50 dark:bg-gray-700/20">
                      <td className="px-6 py-3 font-medium text-gray-700 dark:text-gray-300">MIMO</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">4x4 MIMO</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400">4x4 MIMO, DL MU-MIMO</td>
                      <td className="px-6 py-3 text-center text-gray-600 dark:text-gray-400" colSpan={2}>8x8 UL/DL MU-MIMO</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* MIMO Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 grid md:grid-cols-2 gap-6"
            >
              {/* MIMO Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                    📡
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">MIMO</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Multiple-Input Multiple-Output</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  MIMO uses multiple antennas at both the transmitter and receiver to improve communication performance. 
                  Instead of one data stream, MIMO sends multiple streams simultaneously through different antennas.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>4x4 MIMO</strong> = 4 transmit antennas × 4 receive antennas = up to 4 simultaneous data streams, 
                    dramatically increasing throughput compared to single-antenna systems.
                  </p>
                </div>
              </div>

              {/* MU-MIMO Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    👥
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">MU-MIMO</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Multi-User MIMO</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  MU-MIMO enables the access point to communicate with multiple devices simultaneously instead of one at a time. 
                  This is critical in homes with many connected devices.
                </p>
                <div className="space-y-2">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <strong>DL MU-MIMO</strong> (Wi-Fi 5): Downlink only — AP can send to multiple clients simultaneously, 
                      but clients still respond one at a time.
                    </p>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
                    <p className="text-sm text-pink-700 dark:text-pink-300">
                      <strong>UL/DL MU-MIMO</strong> (Wi-Fi 6): Both directions — AP sends AND receives from multiple clients 
                      at once, significantly reducing latency and congestion.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* GPON Section */}
      <section id="gpon" className="min-h-screen py-16 px-6 bg-blue-50/50 dark:bg-blue-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">
                03 — Technology
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                GPON Technology
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Gigabit Passive Optical Network — The backbone of modern fiber broadband
              </p>
            </div>

            {/* Image + Definition */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <Image
                  src="/images/research/gpon.jpg"
                  alt="GPON Architecture"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">GPON Network Architecture</p>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is GPON?</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  GPON multiplexes multiple subscribers over a single fiber using Time-Division Multiple Access (TDMA) 
                  for upstream and broadcast for downstream. Each ONT receives all downstream data but can only decrypt 
                  its own traffic using AES-128 encryption.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.5 Gbps</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Downstream</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.25 Gbps</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Upstream</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { title: 'Passive Splitting', desc: 'No power required at distribution points—just glass splitting light' },
                { title: 'Shared Bandwidth', desc: 'Up to 64 subscribers share one fiber with DBA allocating capacity' },
                { title: 'Multicast Efficient', desc: 'IPTV streams replicated at OLT, saving upstream bandwidth' },
                { title: 'Long Reach', desc: 'Up to 20km from OLT to ONT without regeneration' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Insight */}
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why GPON?</h3>
              <p className="text-blue-100 leading-relaxed">
                GPON is cost-effective (passive infrastructure), future-proof (high bandwidth), and operationally 
                simple (centralized management at OLT). It perfectly supports Triple Play services with built-in 
                QoS mechanisms and multicast replication for IPTV efficiency.
              </p>
            </div>

            {/* OLT Equipment */}
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our OLT Equipment</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Huawei SmartAX MA5800 Series — deployed across Ulaanbaatar and rural areas
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* 5800-X2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-linear-to-br from-slate-600 to-slate-800 p-6 flex items-center justify-center">
                    <Image
                      src="/images/research/5800x2.jpg"
                      alt="MA5800-X2"
                      width={300}
                      height={200}
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300">Compact OLT</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">MA5800-X2</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Compact chassis OLT for small deployments. Ideal for rural areas and small MDUs with lower subscriber density.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Service Slots</span>
                        <span className="font-medium text-gray-900 dark:text-white">2 slots</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Max GPON Ports</span>
                        <span className="font-medium text-gray-900 dark:text-white">16 ports (8 per card)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Max ONT Connections</span>
                        <span className="font-medium text-gray-900 dark:text-white">2,048 ONTs</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 dark:text-gray-400">Use Case</span>
                        <span className="font-medium text-gray-900 dark:text-white">Rural, small towns</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 5800-X17 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="bg-linear-to-br from-blue-600 to-indigo-800 p-6 flex items-center justify-center">
                    <Image
                      src="/images/research/5800x17.jpg"
                      alt="MA5800-X17"
                      width={300}
                      height={200}
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">High-Capacity OLT</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">MA5800-X17</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      Full-size chassis OLT for high-density deployments. Deployed in Ulaanbaatar for apartment buildings and business districts.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Service Slots</span>
                        <span className="font-medium text-gray-900 dark:text-white">17 slots</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Max GPON Ports</span>
                        <span className="font-medium text-gray-900 dark:text-white">128 ports (8 per card)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Max ONT Connections</span>
                        <span className="font-medium text-gray-900 dark:text-white">16,384 ONTs</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500 dark:text-gray-400">Use Case</span>
                        <span className="font-medium text-gray-900 dark:text-white">Urban, high-density</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Total Deployment Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white"
              >
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">101</div>
                  <div className="text-xl font-medium text-indigo-100 mb-4">Total OLT Devices Deployed</div>
                  <p className="text-indigo-200 max-w-2xl mx-auto">
                    Combined MA5800-X2 and MA5800-X17 units deployed across Ulaanbaatar and rural Mongolia, 
                    providing fiber connectivity to homes and businesses nationwide.
                  </p>
                </div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Fixed Core Network Section */}
      <section id="core" className="min-h-screen py-16 px-6 bg-purple-50/50 dark:bg-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
                04 — Backbone
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                Fixed Core Network
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The high-capacity IP/MPLS backbone connecting access to services
              </p>
            </div>

            {/* Architecture Layers */}
            <div className="space-y-4 mb-12">
              {[
                { 
                  title: 'BRAS / BNG', 
                  subtitle: 'Service Edge', 
                  desc: 'Subscriber session termination, authentication via RADIUS, IP assignment, and policy enforcement. The boundary between access and core.',
                  color: 'border-l-purple-500'
                },
                { 
                  title: 'HCORE', 
                  subtitle: 'Core Routing', 
                  desc: 'High-capacity stateless packet forwarding with MPLS and IP routing. 100G/400G ports, sub-50ms failover, no subscriber logic.',
                  color: 'border-l-pink-500'
                },
                { 
                  title: 'SIG', 
                  subtitle: 'Service Interconnect', 
                  desc: 'Traffic steering to service platforms: CDN, DNS, IPTV middleware, VoIP softswitches. Policy-based routing and NAT.',
                  color: 'border-l-fuchsia-500'
                },
                { 
                  title: 'IGW', 
                  subtitle: 'Internet Gateway', 
                  desc: 'Exit point to global Internet. BGP peering with upstream providers and IXPs like MIX. Route filtering and traffic engineering.',
                  color: 'border-l-violet-500'
                },
              ].map((layer, i) => (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white dark:bg-gray-800 rounded-r-xl p-6 shadow-md border-l-4 ${layer.color}`}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{layer.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {layer.subtitle}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{layer.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* HA & Redundancy */}
            <div className="bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">High Availability Design</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-lg font-semibold mb-2">No Single Point of Failure</div>
                  <p className="text-purple-100 text-sm">All components in active-standby or active-active pairs</p>
                </div>
                <div>
                  <div className="text-lg font-semibold mb-2">MPLS Fast Reroute</div>
                  <p className="text-purple-100 text-sm">Sub-50ms convergence with pre-computed backup paths</p>
                </div>
                <div>
                  <div className="text-lg font-semibold mb-2">ECMP Load Balancing</div>
                  <p className="text-purple-100 text-sm">Traffic distributed across multiple equal-cost paths</p>
                </div>
              </div>
            </div>

            {/* Device Inventory */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Core Network Infrastructure</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Production device inventory across the fixed core network
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { name: 'IGW', count: 2, desc: 'Internet Gateways', color: 'from-violet-500 to-purple-600' },
                  { name: 'HCORE', count: 2, desc: 'Core Routers', color: 'from-pink-500 to-rose-600' },
                  { name: 'HCDN', count: 2, desc: 'CDN Clusters', color: 'from-blue-500 to-cyan-600' },
                  { name: 'BRAS', count: 4, desc: 'Broadband Access', color: 'from-purple-500 to-indigo-600' },
                  { name: 'MiniBRAS', count: 2, desc: 'Compact BNG', color: 'from-fuchsia-500 to-pink-600' },
                  { name: 'Metro', count: 8, desc: 'Aggregation Switches', color: 'from-amber-500 to-orange-600' },
                  { name: 'Spine', count: 2, desc: 'Spine Switches', color: 'from-teal-500 to-green-600' },
                  { name: 'Leaf Switch', count: 16, desc: 'Leaf Switches', color: 'from-emerald-500 to-teal-600' },
                  { name: 'System Switch', count: 2, desc: 'Service Switches', color: 'from-slate-500 to-gray-600' },
                  { name: 'Internet Switch', count: 2, desc: 'Internet Access', color: 'from-indigo-500 to-blue-600' },
                ].map((device, i) => (
                  <motion.div
                    key={device.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 text-center"
                  >
                    <div className={`text-3xl font-bold bg-linear-to-r ${device.color} bg-clip-text text-transparent mb-1`}>
                      {device.count}
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{device.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{device.desc}</div>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-8 bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">42</div>
                <div className="text-gray-300">Total Core Network Devices</div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400">
            ISP Network Architecture • Minimal Presentation
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/" className="text-sm text-violet-600 dark:text-violet-400 hover:underline">
              ← Back to Home
            </Link>
            <Link href="/topology" className="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">
              View Topology →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
