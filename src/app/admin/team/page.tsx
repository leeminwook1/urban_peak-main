"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface TeamMember {
  id: number;
  role: string;
  name: string;
  description: string;
  profile_image: string;
  display_order: number;
}

const EMPTY: Omit<TeamMember, "id"> = {
  role: "", name: "", description: "", profile_image: "", display_order: 0,
};

export default function AdminTeamPage() {
  const [auth, setAuth] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/team");
    setMembers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("adminAuth") === "ydp12000") {
        setAuth(true);
      } else {
        window.location.href = "/admin";
      }
    }
  }, []);

  useEffect(() => { if (auth) load(); }, [auth, load]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY, display_order: members.length });
    setShowForm(true);
  }

  function openEdit(m: TeamMember) {
    setEditingId(m.id);
    setForm({ role: m.role, name: m.name, description: m.description, profile_image: m.profile_image ?? "", display_order: m.display_order });
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('업로드 실패');
      
      const { url } = await res.json();
      setForm(f => ({ ...f, profile_image: url }));
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editingId !== null ? `/api/team/${editingId}` : "/api/team";
      await fetch(url, { method: editingId !== null ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      await load();
      setShowForm(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">팀원 관리</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-[#1a1a2e] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80">
          <Plus size={15} /> 새 팀원
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1a1a1a]">{editingId !== null ? "팀원 수정" : "새 팀원"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#8a8a8a] hover:text-[#1a1a1a]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {(["role", "name"] as const).map(key => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-[#6b6b6b]">{key === "role" ? "직급/팀 (예: CREATIVE DIRECTOR)" : "이름"}</label>
                  <input type="text" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-[#e5e0d8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a2e]" />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-[#6b6b6b]">프로필 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full rounded-xl border border-[#e5e0d8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a2e] file:mr-3 file:rounded-lg file:border-0 file:bg-[#1a1a2e] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50"
                />
                {uploading && <p className="mt-1 text-xs text-[#6b6b6b]">업로드 중...</p>}
                {form.profile_image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.profile_image} alt="preview" className="h-16 w-16 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, profile_image: '' }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#6b6b6b]">포지션 설명</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full resize-none rounded-xl border border-[#e5e0d8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a2e]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#6b6b6b]">순서</label>
                <input type="number" value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-[#e5e0d8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a2e]" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1a1a2e] py-3 text-sm font-medium text-white disabled:opacity-50 hover:opacity-80">
                <Check size={15} />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full border border-[#e5e0d8] py-3 text-sm font-medium text-[#6b6b6b] hover:border-[#1a1a1a]">취소</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-sm text-[#8a8a8a]">불러오는 중...</p> : (
        <div className="space-y-3">
          {members.length === 0 && <p className="text-sm text-[#8a8a8a]">등록된 팀원이 없습니다.</p>}
          {members.map(m => (
            <div key={m.id} className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                {m.profile_image && (
                  <img src={m.profile_image} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                )}
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#a0a0a0]">{m.role}</span>
                  <p className="mt-0.5 text-lg font-bold text-[#1a1a1a]">{m.name}</p>
                  <p className="text-xs text-[#8a8a8a]">{m.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(m)} className="rounded-xl border border-[#e5e0d8] p-2 text-[#6b6b6b] hover:border-[#1a1a2e] hover:text-[#1a1a2e]"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(m.id)} className="rounded-xl border border-[#e5e0d8] p-2 text-[#6b6b6b] hover:border-red-400 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
