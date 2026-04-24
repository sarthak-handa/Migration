'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Layers, Component as ComponentIcon, LayoutGrid, Clock } from 'lucide-react';

interface ComponentData {
  _id: string;
  serialNumber: string;
  name: string;
  description: string;
  status: string;
}

interface SubassemblyData {
  _id: string;
  serialNumber: string;
  name: string;
  status: string;
  components: ComponentData[];
}

interface AssemblyData {
  _id: string;
  serialNumber: string;
  name: string;
  status: string;
  subassemblies: SubassemblyData[];
  components: ComponentData[];
}

interface Project {
  _id: string;
  name: string;
  plannedStart: string;
  dueDate: string;
  division: string;
  label: string;
  description: string;
  assemblies: AssemblyData[];
}

const statusColors: Record<string, string> = {
  design: 'bg-blue-100 text-blue-700',
  ordering: 'bg-orange-100 text-orange-700',
  manufacturing: 'bg-purple-100 text-purple-700',
  assembly: 'bg-indigo-100 text-indigo-700',
  dispatch: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  design: 'Design',
  ordering: 'Ordering',
  manufacturing: 'Manufacturing',
  assembly: 'Assembly',
  dispatch: 'Dispatch',
};

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/hierarchy`);
      const data = await res.json();
      setProject(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const updateStatus = async (type: 'assembly' | 'subassembly' | 'component', itemId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId, status: newStatus }),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-center">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image src="/YDLOGO.png" alt="Logo" width={60} height={30} />
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
          </div>
          <div className="flex space-x-4">
             <button 
              onClick={() => {
                fetch(`/api/projects/${id}/parse`, { method: 'POST' }).then(() => fetchProject());
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Re-parse BOM
            </button>
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Close
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Division / Label</p>
              <p className="text-lg font-semibold text-gray-900">{project.division} - {project.label}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 font-medium">Planned Schedule</p>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-gray-700">
                  {new Date(project.plannedStart).toLocaleDateString()} — {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500 mb-1 font-medium">BOM Progress</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
            </div>
          </div>
          {project.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Project Hierarchy</h2>
            <div className="text-xs text-gray-500">Click items to expand</div>
          </div>

          <div className="divide-y divide-gray-100">
            {project.assemblies.map(assembly => (
              <AssemblyRow 
                key={assembly._id} 
                assembly={assembly} 
                expanded={expandedItems[assembly._id]} 
                onToggle={() => toggleExpand(assembly._id)}
                onStatusUpdate={(id: string, status: string) => updateStatus('assembly', id, status)}
                expandedItems={expandedItems}
                onToggleItem={toggleExpand}
                onUpdateStatus={updateStatus}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

interface RowProps {
    onStatusUpdate: (id: string, status: string) => void;
    onToggleItem: (id: string) => void;
    onUpdateStatus: (type: 'assembly' | 'subassembly' | 'component', itemId: string, newStatus: string) => void;
    expandedItems: Record<string, boolean>;
}

function AssemblyRow({ assembly, expanded, onToggle, onStatusUpdate, expandedItems, onToggleItem, onUpdateStatus }: { assembly: AssemblyData, expanded: boolean, onToggle: () => void } & RowProps) {
  return (
    <div>
      <div 
        className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${expanded ? 'bg-gray-50/50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-400 font-mono">{assembly.serialNumber}</span>
              <h3 className="text-base font-semibold text-gray-900">{assembly.name}</h3>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <StatusSelect status={assembly.status} onChange={(s: string) => { onStatusUpdate(assembly._id, s); }} />
          {expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="bg-gray-50/30 pl-16 pr-6 pb-4">
          {assembly.subassemblies?.map((sub) => (
            <SubassemblyRow 
               key={sub._id} 
               sub={sub} 
               expanded={expandedItems[sub._id]} 
               onToggle={() => onToggleItem(sub._id)}
               onStatusUpdate={(id: string, s: string) => onUpdateStatus('subassembly', id, s)}
               onUpdateStatus={onUpdateStatus}
            />
          ))}
          {assembly.components?.map((comp) => (
            <ComponentRow 
                key={comp._id} 
                component={comp} 
                onStatusUpdate={(id: string, s: string) => onUpdateStatus('component', id, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubassemblyRow({ sub, expanded, onToggle, onStatusUpdate, onUpdateStatus }: { sub: SubassemblyData, expanded: boolean, onToggle: () => void, onStatusUpdate: (id: string, s: string) => void, onUpdateStatus: (type: 'assembly' | 'subassembly' | 'component', itemId: string, newStatus: string) => void }) {
  return (
    <div className="mt-2 border-l-2 border-gray-200 pl-4">
      <div 
        className="flex items-center justify-between py-3 cursor-pointer hover:text-gray-900 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-400 font-mono">{sub.serialNumber}</span>
          <h4 className="text-sm font-medium text-gray-700">{sub.name}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <StatusSelect size="sm" status={sub.status} onChange={(s: string) => onStatusUpdate(sub._id, s)} />
          {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      {expanded && (
        <div className="pl-8 space-y-2 pb-2">
          {sub.components?.map((comp) => (
            <ComponentRow 
                key={comp._id} 
                component={comp} 
                onStatusUpdate={(id: string, s: string) => onUpdateStatus('component', id, s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentRow({ component, onStatusUpdate }: { component: ComponentData, onStatusUpdate: (id: string, s: string) => void }) {
  return (
    <div className="flex items-center justify-between py-2 pl-4 border-l border-gray-200">
      <div className="flex items-center space-x-3">
        <ComponentIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-[10px] font-bold text-gray-400 font-mono">{component.serialNumber}</span>
        <span className="text-sm text-gray-600">{component.name}</span>
      </div>
      <StatusSelect size="xs" status={component.status} onChange={(s: string) => onStatusUpdate(component._id, s)} />
    </div>
  );
}

function StatusSelect({ status, onChange, size = 'md' }: { status: string, onChange: (s: string) => void, size?: 'xs' | 'sm' | 'md' }) {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <select 
      value={status}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value)}
      className={`${sizeClasses[size]} rounded-full font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'} appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 text-center border-none`}
    >
      {Object.entries(statusLabels).map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  );
}
