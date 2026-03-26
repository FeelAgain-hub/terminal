'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface Clinician {
  id: string;
  name: string;
  spec: string;
  ver: string;
  sessions: number;
  status: string;
  advanced?: boolean;
}

interface RegistryProps {
  clinicians: Clinician[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  FormattedValue: React.FC<{ value: number }>;
  lang: Language;
}

type SortField = 'name' | 'sessions' | 'status';
type SortOrder = 'asc' | 'desc';

const ITEMS_PER_PAGE = 7;

export default function ClinicianRegistry({ clinicians, searchQuery, setSearchQuery, FormattedValue, lang }: RegistryProps) {
  const t = translations[lang];
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [specFilter, setSpecFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, specFilter, statusFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const translateSpec = (spec: string) => {
    const specMap: Record<string, string> = {
      'PTSD / Trauma': t.ptsdTrauma,
      'CBT / Anxiety': t.cbtAnxiety,
      'Child Psychology': t.childPsych,
      'Military Rehab': t.militaryRehab,
      'Crisis Intervention': t.crisisIntervention,
      'Addiction Recovery': t.addictionRecovery,
      'Family Therapy': t.familyTherapy,
      'Grief Counseling': t.griefCounseling,
      'Art Therapy': t.artTherapy,
      'Neuropsychology': t.neuropsychology,
      'Group Therapy': t.groupTherapy,
      'Rehabilitation': t.rehabilitation,
      'Clinical Psych': t.clinicalPsych,
    };
    return specMap[spec] || spec;
  };

  const translateStatus = (status: string) => {
    if (status === 'ACTIVE') return t.active;
    if (status === 'ON LEAVE') return t.onLeave;
    return status;
  };

  const specializations = useMemo(() => {
    const specs = Array.from(new Set(clinicians.map(c => c.spec)));
    return specs.sort();
  }, [clinicians]);

  const statuses = useMemo(() => {
    const stats = Array.from(new Set(clinicians.map(c => c.status)));
    return stats.sort();
  }, [clinicians]);

  const filteredAndSortedClinicians = useMemo(() => {
    let filtered = clinicians.filter(c => 
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.spec.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (specFilter === 'all' || c.spec === specFilter) &&
      (statusFilter === 'all' || c.status === statusFilter)
    );

    filtered = filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'sessions') {
        comparison = a.sessions - b.sessions;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [clinicians, searchQuery, sortField, sortOrder, specFilter, statusFilter]);

  const totalPages = Math.ceil(filteredAndSortedClinicians.length / ITEMS_PER_PAGE);
  const paginatedClinicians = filteredAndSortedClinicians.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />;
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">{t.clinicianRegistry}</h2>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#F59E0B]/50 w-48 transition-all" 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F59E0B]/50 max-w-[140px] appearance-none cursor-pointer"
            >
              <option value="all" className="bg-[#050A15]">{t.allSpecializations}</option>
              {specializations.map(spec => (
                <option key={spec} value={spec} className="bg-[#050A15]">{translateSpec(spec)}</option>
              ))}
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-[#F59E0B]/50 cursor-pointer appearance-none"
            >
              <option value="all" className="bg-[#050A15]">{t.allStatuses}</option>
              {statuses.map(status => (
                <option key={status} value={status} className="bg-[#050A15]">{translateStatus(status)}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-md bg-white/5 text-[10px] font-mono text-slate-500">
            {t.found}: <span className="text-[#F59E0B]">{filteredAndSortedClinicians.length}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#050A15] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5 sticky top-0 z-10">
              <tr>
                <th 
                  className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    {t.clinician} <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-3 font-medium">{t.specialization}</th>
                <th className="px-6 py-3 font-medium">{t.verification}</th>
                <th 
                  className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('sessions')}
                >
                  <div className="flex items-center">
                    {t.sessions} <SortIcon field="sessions" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    {t.status} <SortIcon field="status" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedClinicians.map((clinician) => (
                <tr key={clinician.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="text-white font-medium text-xs">{clinician.name}</div>
                      {clinician.advanced && (
                        <div className="group relative">
                          <ShieldCheck className="w-3 h-3 text-[#00F5FF] drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#050A15] border border-white/10 rounded text-[8px] text-[#00F5FF] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {t.advancedVerification}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">{clinician.id}</div>
                  </td>
                  <td className="px-6 py-3 text-slate-400 text-xs">{translateSpec(clinician.spec)}</td>
                  <td className="px-6 py-3">
                    <span className="text-[9px] font-bold text-[#00FF66] border border-[#00FF66]/30 px-2 py-0.5 rounded bg-[#00FF66]/5">{clinician.ver}</span>
                  </td>
                  <td className="px-6 py-3 font-mono text-slate-300 text-xs">
                    <FormattedValue value={clinician.sessions} />
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-[9px] font-bold ${clinician.status === 'ACTIVE' ? 'text-[#00FF66]' : 'text-slate-500'}`}>
                      {translateStatus(clinician.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredAndSortedClinicians.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest">
                    {t.noClinicians}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-auto border-t border-white/5 bg-white/[0.02] px-6 py-3 flex items-center justify-between">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
              {t.page} <span className="text-white">{currentPage}</span> {t.of} <span className="text-white">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-6 h-6 rounded-md text-[10px] font-mono border transition-all ${
                      currentPage === page 
                        ? 'bg-[#F59E0B] border-[#F59E0B] text-[#050A15] font-bold' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-white/10 bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
