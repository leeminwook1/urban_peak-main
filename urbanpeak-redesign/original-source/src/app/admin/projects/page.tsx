"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Project {
  id: number;
  tag: string;
  title: string;
  category: string;
  description: string;
  symbol_url: string;
  thumbnail_url: string;
  gallery_images: string;
  display_order: number;
  status: string;
}

const SYMBOL_OPTIONS = [
  { label: "Orange", value: "/images/logos/symbol-orange.png" },
  { label: "Teal", value: "/images/logos/symbol-teal.png" },
  { label: "Black", value: "/images/logos/symbol-black.png" },
  { label: "Outline", value: "/images/logos/symbol-outline.png" },
];

const EMPTY: Omit<Project, "id"> = {
  tag: "", title: "", category: "", description: "",
  symbol_url: "/images/logos/symbol-orange.png", thumbnail_url: "", gallery_images: "[]", display_order: 0, status: "upcoming",
};

export default function AdminProjectsPage() {
  const [auth, setAuth] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
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
    setForm({ ...EMPTY, display_order: projects.length });
    setGalleryImages([]);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({ tag: p.tag, title: p.title, category: p.category, description: p.description, symbol_url: p.symbol_url, thumbnail_url: p.thumbnail_url ?? "", gallery_images: p.gallery_images ?? "[]", display_order: p.display_order, status: p.status ?? "upcoming" });
    try {
      setGalleryImages(JSON.parse(p.gallery_images || "[]"));
    } catch {
      setGalleryImages([]);
    }
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...form, gallery_images: JSON.stringify(galleryImages) };
      const url = editingId !== null ? `/api/projects/${editingId}` : "/api/projects";
      await fetch(url, { method: editingId !== null ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      await load();
      setShowForm(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    await load();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다.'); return; }
    setUploading(true);
    try {
      const { resizeImage } = await import('@/lib/resizeImage');
      const resized = await resizeImage(file);
      const formData = new FormData();
      formData.append('file', resized);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');
      const { url } = await res.json();
      setForm(f => ({ ...f, thumbnail_url: url }));
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally { setUploading(false); }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { resizeImage } = await import('@/lib/resizeImage');
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) return null;
        const resized = await resizeImage(file);
        const formData = new FormData();
        formData.append('file', resized);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) return null;
        const { url } = await res.json();
        return url;
      });
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      setGalleryImages(prev => [...prev, ...validUrls]);
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally { setUploading(false); }
  }

  function removeGalleryImage(index: number) {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  }

  const field = (label: string, key: keyof typeof form, type = "text") => (
    <div key={key}>
      <label className="mb-1 block text-xs font-medium text-[#666666]">{label}</label>
      {key === "description" ? (
        <textarea rows={8} value={form[key] as string} onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
          className="w-full resize-none border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000]" />
      ) : (
        <input type={type} value={form[key] as string | number} onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
          className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000]" />
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#000000]">프로젝트 관리</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-full bg-[#000000] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80">
          <Plus size={15} /> 새 기획안
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#000000]">{editingId !== null ? "기획안 수정" : "새 기획안"}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#666666] hover:text-[#000000]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {field("태그 (예: 기획안 01)", "tag")}
              {field("제목", "title")}
              {field("카테고리", "category")}
              {field("설명", "description")}
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">대표 이미지 (카드에 표시)</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="flex-1 border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000] file:mr-3 file:file:border-0 file:bg-[#000000] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50"
                  />
                </div>
                {uploading && <p className="mt-1 text-xs text-[#666666]">업로드 중...</p>}
                {form.thumbnail_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.thumbnail_url} alt="preview" className="h-16 w-16 object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, thumbnail_url: '' }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">갤러리 이미지 (여러 장)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploading}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000] file:mr-3 file:file:border-0 file:bg-[#000000] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50"
                />
                {galleryImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {galleryImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`gallery ${idx}`} className="h-20 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">심볼 이미지</label>
                <select value={form.symbol_url} onChange={e => setForm(f => ({ ...f, symbol_url: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000]">
                  {SYMBOL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {field("순서", "display_order", "number")}
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">상태</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm text-[#000000] outline-none focus:border-[#000000]">
                  <option value="upcoming">진행 예정 · 현재 진행</option>
                  <option value="past">지난 프로젝트</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#000000] py-3 text-sm font-medium text-white disabled:opacity-50 hover:opacity-80">
                <Check size={15} />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full border border-black py-3 text-sm font-medium text-[#666666] hover:border-[#000000]">취소</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-sm text-[#666666]">불러오는 중...</p> : (
        <div className="space-y-3">
          {projects.length === 0 && <p className="text-sm text-[#666666]">등록된 기획안이 없습니다.</p>}
          {projects.map(p => (
            <div key={p.id} className="flex items-center justify-between bg-white px-6 py-5 shadow-sm">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#666666]">{p.tag}</span>
                <p className="mt-0.5 font-bold text-[#000000]">{p.title}</p>
                <p className="text-xs text-[#666666]">{p.category}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${p.status === 'past' ? 'bg-[#F5F5F5] text-[#666666]' : 'bg-[#000000]/10 text-[#000000]'}`}>
                  {p.status === 'past' ? '지난 프로젝트' : '진행 예정 · 현재'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="border border-black p-2 text-[#666666] hover:border-[#000000] hover:text-[#000000]"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(p.id)} className="border border-black p-2 text-[#666666] hover:border-red-400 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
