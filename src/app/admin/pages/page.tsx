"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface PageSetting {
  page_key: string;
  title: string;
  subtitle: string;
  banner_image: string;
}

const PAGE_LABELS: Record<string, { name: string; labelLeft: string; labelRight: string }> = {
  story:       { name: "Story 페이지",       labelLeft: "Story",       labelRight: "어반피크" },
  projects:    { name: "Projects 페이지",    labelLeft: "Projects",    labelRight: "진행 프로젝트" },
  merchandise: { name: "Merchandise 페이지", labelLeft: "Merchandise", labelRight: "어반피크 굿즈" },
  contact:     { name: "Contact 페이지",     labelLeft: "Contact",     labelRight: "협업 제안" },
};

const PAGE_KEYS = ["story", "projects", "merchandise", "contact"];

export default function AdminPagesPage() {
  const [auth, setAuth] = useState(false);
  const [settings, setSettings] = useState<Record<string, PageSetting>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", banner_image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("adminAuth") === "ydp12000") setAuth(true);
      else window.location.href = "/admin";
    }
  }, []);

  useEffect(() => {
    if (!auth) return;
    Promise.all(PAGE_KEYS.map(key =>
      fetch(`/api/page-settings/${key}`).then(r => r.json())
    )).then(results => {
      const map: Record<string, PageSetting> = {};
      results.forEach((r, i) => { if (r) map[PAGE_KEYS[i]] = r; });
      setSettings(map);
    });
  }, [auth]);

  function openEdit(key: string) {
    const s = settings[key];
    setForm({
      title: s?.title || "",
      subtitle: s?.subtitle || "",
      banner_image: s?.banner_image || "",
    });
    setEditing(key);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/page-settings/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSettings(prev => ({ ...prev, [editing]: data }));
      setEditing(null);
    } finally { setSaving(false); }
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
      setForm(f => ({ ...f, banner_image: url }));
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
    } finally { setUploading(false); }
  }

  if (!auth) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#000000]">페이지 설정</h1>
        <p className="mt-1 text-sm text-[#666666]">각 페이지의 상단 배너 이미지와 타이틀을 수정합니다.</p>
      </div>

      {/* 수정 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#000000]">{PAGE_LABELS[editing]?.name} 수정</h2>
              <button onClick={() => setEditing(null)} className="text-[#666666] hover:text-[#000000]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">타이틀 (줄바꿈: \n 입력)</label>
                <textarea
                  rows={3}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={"예: 어반피크가 함께 하는\n프로젝트"}
                  className="w-full resize-none border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]"
                />
                <p className="mt-1 text-[11px] text-[#666666]">줄바꿈은 Enter 키로 입력하세요.</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">서브타이틀</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">배너 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none file:mr-3 file:file:border-0 file:bg-[#000000] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50"
                />
                {uploading && <p className="mt-1 text-xs text-[#666666]">업로드 중...</p>}
                {form.banner_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={form.banner_image} alt="preview" className="h-20 w-36 object-cover" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, banner_image: '' }))} className="text-xs text-red-500 hover:underline">삭제</button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#000000] py-3 text-sm font-medium text-white disabled:opacity-50 hover:opacity-80">
                <Check size={15} />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-black py-3 text-sm font-medium text-[#666666] hover:border-[#000000]">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 페이지 목록 */}
      <div className="space-y-3">
        {PAGE_KEYS.map(key => {
          const s = settings[key];
          const label = PAGE_LABELS[key];
          return (
            <div key={key} className="flex items-center justify-between bg-white px-6 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                {s?.banner_image ? (
                  <img src={s.banner_image} alt={label.name} className="h-14 w-24 object-cover" />
                ) : (
                  <div className="h-14 w-24 bg-[#F5F5F5] flex items-center justify-center">
                    <span className="text-[10px] text-[#666666]">이미지 없음</span>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#666666]">{label.labelLeft}</p>
                  <p className="mt-0.5 font-bold text-[#000000]">{label.name}</p>
                  <p className="text-xs text-[#666666] line-clamp-1">{s?.title || "기본 타이틀 사용 중"}</p>
                </div>
              </div>
              <button
                onClick={() => openEdit(key)}
                className="border border-black px-4 py-2 text-sm text-[#666666] hover:border-[#000000] hover:text-[#000000]"
              >
                수정
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
