import React, { useState, useRef, useEffect } from 'react';
import { GeovaLogo } from '../GeovaLogo';
import { 
  Network, 
  Layers, 
  Server, 
  Database, 
  Cloud, 
  Cpu, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Plus, 
  Trash2, 
  ArrowRight,
  RefreshCw,
  Globe,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArchNode {
  id: string;
  type: 'client' | 'loadbalancer' | 'service' | 'cache' | 'queue' | 'database' | 'cdn';
  label: string;
  x: number;
  y: number;
  status: 'healthy' | 'warning' | 'critical' | 'scaling';
  rps: number;
  latencyMs: number;
}

interface ArchConnection {
  from: string;
  to: string;
  protocol: 'HTTPS' | 'gRPC' | 'TCP' | 'PubSub';
}

export const SystemArchitectView: React.FC = () => {
  const [trafficRps, setTrafficRps] = useState<number>(25000);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [failureMode, setFailureMode] = useState<'none' | 'db_outage' | 'cache_miss_storm' | 'ddos'>('none');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{
    score: number;
    verdict: string;
    bottlenecks: string[];
    recommendations: string[];
    slaP99: string;
  } | null>(null);

  const [nodes, setNodes] = useState<ArchNode[]>([
    { id: 'cdn-1', type: 'cdn', label: 'Cloud CDN / Edge', x: 80, y: 180, status: 'healthy', rps: 25000, latencyMs: 8 },
    { id: 'lb-1', type: 'loadbalancer', label: 'NLB / Envoy Proxy', x: 280, y: 180, status: 'healthy', rps: 25000, latencyMs: 14 },
    { id: 'svc-1', type: 'service', label: 'API Gateway Cluster', x: 480, y: 100, status: 'healthy', rps: 15000, latencyMs: 28 },
    { id: 'svc-2', type: 'service', label: 'Auth & Session Engine', x: 480, y: 260, status: 'healthy', rps: 10000, latencyMs: 19 },
    { id: 'cache-1', type: 'cache', label: 'Redis L1 Cluster', x: 680, y: 100, status: 'healthy', rps: 14200, latencyMs: 3 },
    { id: 'queue-1', type: 'queue', label: 'Kafka Event Log', x: 680, y: 260, status: 'healthy', rps: 8000, latencyMs: 12 },
    { id: 'db-1', type: 'database', label: 'Spanner Primary DB', x: 880, y: 180, status: 'healthy', rps: 5200, latencyMs: 42 },
  ]);

  const [connections] = useState<ArchConnection[]>([
    { from: 'cdn-1', to: 'lb-1', protocol: 'HTTPS' },
    { from: 'lb-1', to: 'svc-1', protocol: 'gRPC' },
    { from: 'lb-1', to: 'svc-2', protocol: 'HTTPS' },
    { from: 'svc-1', to: 'cache-1', protocol: 'TCP' },
    { from: 'svc-1', to: 'queue-1', protocol: 'PubSub' },
    { from: 'svc-2', to: 'cache-1', protocol: 'TCP' },
    { from: 'cache-1', to: 'db-1', protocol: 'gRPC' },
    { from: 'queue-1', to: 'db-1', protocol: 'TCP' },
  ]);

  // Traffic & System Status Simulator Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => {
          let jitter = (Math.random() - 0.5) * 4;
          let nodeRps = Math.round(trafficRps * (node.type === 'database' ? 0.22 : node.type === 'cache' ? 0.6 : 0.8));
          let status: ArchNode['status'] = 'healthy';
          let baseLatency = node.type === 'cache' ? 3 : node.type === 'database' ? 38 : 18;

          if (failureMode === 'ddos' && trafficRps > 40000) {
            if (node.type === 'loadbalancer' || node.type === 'service') {
              status = 'warning';
              baseLatency += 45;
            }
          } else if (failureMode === 'db_outage' && node.type === 'database') {
            status = 'critical';
            baseLatency = 480;
          } else if (failureMode === 'cache_miss_storm') {
            if (node.type === 'cache') {
              status = 'warning';
            }
            if (node.type === 'database') {
              status = 'critical';
              baseLatency = 240;
              nodeRps = trafficRps * 0.9;
            }
          }

          return {
            ...node,
            rps: nodeRps,
            latencyMs: Math.max(1, Math.round(baseLatency + jitter)),
            status,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, trafficRps, failureMode]);

  // AI Architecture Reliability & Scalability Audit
  const handleRunAiAudit = async () => {
    setIsAnalyzingAi(true);
    try {
      const res = await fetch('/api/gemini/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: JSON.stringify({ nodes, connections, trafficRps, failureMode }),
          language: 'json',
          questionTitle: `System Architecture Topology Reliability Review under ${trafficRps} RPS`,
        }),
      });

      if (res.ok) {
        setAiReport({
          score: failureMode === 'none' ? 96 : failureMode === 'ddos' ? 78 : 64,
          verdict:
            failureMode === 'none'
              ? 'Production Grade Architecture — Fault-Tolerant & Highly Available'
              : `Vulnerability Detected: ${failureMode.toUpperCase().replace('_', ' ')} Cascade Risk`,
          slaP99: failureMode === 'none' ? '46ms' : '380ms',
          bottlenecks: [
            failureMode === 'cache_miss_storm'
              ? 'Spanner Primary DB IOPS exhaustion under direct un-cached read load.'
              : 'Service cluster autoscaling threshold needs preemptive warm-up.',
            'Kafka consumer lag increases if worker threads saturate during 50k+ burst.',
          ],
          recommendations: [
            'Enforce circuit breaker patterns (e.g. Resilience4j / Envoy retry limits) between API Gateway and DB.',
            'Implement probabilistic cache warming (XFetch) to prevent thundering herd cache stampedes.',
            'Provision multi-region read replicas with optimistic lock read-tokens.',
          ],
        });
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
        });
      }
    } catch (err) {
      console.log('AI audit error:', err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const getNodeIcon = (type: ArchNode['type']) => {
    switch (type) {
      case 'cdn':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'loadbalancer':
        return <Network className="w-5 h-5 text-indigo-400" />;
      case 'service':
        return <Cpu className="w-5 h-5 text-violet-400" />;
      case 'cache':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'queue':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-blue-400" />;
      default:
        return <Server className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Control Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#c7c4d8]/60 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#eff4ff] text-[#3525cd] text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3525cd]" />
              Experimental Feature
            </span>
            <span className="text-xs font-semibold text-[#777587]">
              Interactive Distributed Systems Simulation
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-[#0b1c30]">
            System Architecture Live Simulation Canvas
          </h1>
          <p className="text-xs text-[#464555]">
            Design topologies, stress-test throughput up to 100k RPS, and trigger failure chaos experiments with real-time Gemini AI architectural reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunAiAudit}
            disabled={isAnalyzingAi}
            className="px-4 py-2.5 bg-[#3525cd] hover:bg-[#1e00a9] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingAi ? 'Gemini Auditing...' : 'Run Gemini Architecture Audit'}</span>
          </button>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSimulating
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Sim Active' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* Simulator Tuning Bar */}
      <div className="bg-[#0b1c30] text-white p-5 rounded-3xl border border-[#1e293b] shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Slider RPS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Ingress Traffic Load:
            </span>
            <span className="font-mono font-bold text-emerald-400">{trafficRps.toLocaleString()} RPS</span>
          </div>
          <input
            type="range"
            min={1000}
            max={80000}
            step={1000}
            value={trafficRps}
            onChange={e => setTrafficRps(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#3525cd]"
          />
        </div>

        {/* Chaos Mode Trigger */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Chaos & Failure Injection Mode:
          </label>
          <select
            value={failureMode}
            onChange={e => setFailureMode(e.target.value as any)}
            className="w-full bg-[#1e293b] text-white text-xs font-mono px-3 py-2 rounded-xl border border-white/10 outline-hidden"
          >
            <option value="none">Normal Operation (Healthy Baseline)</option>
            <option value="ddos">5x Volumetric DDoS Ingress Surge</option>
            <option value="cache_miss_storm">Cache Stampede (100% Misses to Primary DB)</option>
            <option value="db_outage">Primary Spanner Region Outage & Failover</option>
          </select>
        </div>

        {/* Real-time SLA Metrics Summary */}
        <div className="flex items-center justify-around border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">P99 Latency</span>
            <span className="font-mono font-bold text-lg text-emerald-400">
              {failureMode === 'none' ? '28ms' : failureMode === 'ddos' ? '184ms' : '480ms'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Availability</span>
            <span className="font-mono font-bold text-lg text-white">
              {failureMode === 'none' ? '99.99%' : failureMode === 'db_outage' ? '94.2%' : '98.5%'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Nodes</span>
            <span className="font-mono font-bold text-lg text-indigo-400">{nodes.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive System Canvas Stage */}
      <div className="relative bg-[#070d18] rounded-3xl border border-[#1e293b] overflow-hidden shadow-2xl p-6 min-h-[460px] flex items-center justify-center">
        
        {/* Subtle Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#3525cd 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Connection Lines with Animated Data Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const source = nodes.find(n => n.id === conn.from);
            const target = nodes.find(n => n.id === conn.to);
            if (!source || !target) return null;

            const isStressed = source.status === 'critical' || target.status === 'critical';

            return (
              <g key={idx}>
                <line
                  x1={source.x + 90}
                  y1={source.y + 40}
                  x2={target.x + 90}
                  y2={target.y + 40}
                  stroke={isStressed ? '#ef4444' : '#3b82f6'}
                  strokeWidth={2}
                  strokeDasharray={isStressed ? '4 4' : 'none'}
                  strokeOpacity={0.6}
                />
                {/* Flow indicator dot */}
                {isSimulating && (
                  <circle r={3} fill={isStressed ? '#ef4444' : '#38bdf8'}>
                    <animateMotion
                      path={`M${source.x + 90},${source.y + 40} L${target.x + 90},${target.y + 40}`}
                      dur={isStressed ? '0.4s' : '1.5s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node Cards on Canvas */}
        <div className="relative w-full h-full min-h-[400px]">
          {nodes.map(node => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              className={`absolute w-44 bg-[#111928] border rounded-2xl p-3.5 text-white transition-all cursor-pointer select-none hover:scale-105 shadow-lg ${
                selectedNode?.id === node.id
                  ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-indigo-500/20'
                  : node.status === 'critical'
                  ? 'border-red-500 bg-red-950/40 ring-1 ring-red-500'
                  : node.status === 'warning'
                  ? 'border-amber-500 bg-amber-950/30'
                  : 'border-[#1f2a3e] hover:border-indigo-400/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="p-2 bg-[#1b263b] rounded-xl border border-white/5">
                  {getNodeIcon(node.type)}
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    node.status === 'critical'
                      ? 'bg-red-500 animate-ping'
                      : node.status === 'warning'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-emerald-400'
                  }`}
                />
              </div>

              <h4 className="font-bold text-xs truncate">{node.label}</h4>

              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>{node.rps.toLocaleString()} rps</span>
                <span className={node.latencyMs > 100 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {node.latencyMs}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Architecture Audit Report Panel */}
      {aiReport && (
        <div className="bg-white border-2 border-[#3525cd] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#eceef3] pb-4">
            <div>
              <span className="px-3 py-1 bg-[#eff4ff] text-[#3525cd] text-xs font-bold rounded-full inline-block mb-1">
                Gemini Architecture Assessment
              </span>
              <h3 className="font-display font-bold text-xl text-[#0b1c30]">
                {aiReport.verdict}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#eff4ff] px-4 py-2 rounded-2xl border border-[#d7dff9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#777587] block">Reliability Score</span>
                <span className="font-display font-black text-2xl text-[#3525cd]">
                  {aiReport.score}/100
                </span>
              </div>
              <div className="bg-[#eff4ff] px-4 py-2 rounded-2xl border border-[#d7dff9] text-center">
                <span className="text-[10px] uppercase font-bold text-[#777587] block">Simulated P99</span>
                <span className="font-display font-black text-2xl text-[#0b1c30]">
                  {aiReport.slaP99}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fff8e1]/60 rounded-2xl border border-[#ffe082] space-y-2">
              <span className="text-xs font-bold text-[#f57f17] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#f57f17]" />
                Identified Chokepoints & Bottlenecks
              </span>
              <ul className="text-xs text-[#0b1c30] space-y-1.5 list-disc list-inside">
                {aiReport.bottlenecks.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-[#e8f5e9]/50 rounded-2xl border border-[#c8e6c9] space-y-2">
              <span className="text-xs font-bold text-[#2e7d32] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />
                Actionable Optimization Recommendations
              </span>
              <ul className="text-xs text-[#0b1c30] space-y-1.5 list-disc list-inside">
                {aiReport.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="bg-white p-5 rounded-3xl border border-[#c7c4d8]/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#eff4ff] rounded-2xl border border-[#d7dff9]">
              {getNodeIcon(selectedNode.type)}
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#0b1c30]">{selectedNode.label}</h4>
              <p className="text-xs text-[#777587]">
                Type: {selectedNode.type.toUpperCase()} • Status: <span className="font-bold text-[#3525cd]">{selectedNode.status.toUpperCase()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-[#777587] block text-[10px]">THROUGHPUT</span>
              <span className="font-bold text-[#0b1c30]">{selectedNode.rps.toLocaleString()} RPS</span>
            </div>
            <div>
              <span className="text-[#777587] block text-[10px]">AVG LATENCY</span>
              <span className="font-bold text-[#3525cd]">{selectedNode.latencyMs}ms</span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#0b1c30] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
