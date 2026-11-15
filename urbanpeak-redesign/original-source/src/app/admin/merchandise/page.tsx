"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Section {
  id: number;
  title: string;
  subtitle: string;
  banner_image: string;
  display_order: number;
}

interface MerchandiseItem {
  id: number;
  name: string;
  description: string;
  image_url: string;
  images: string;
  section_id: number | null;
  display_order: number;
}

const EMPTY_SECTION: Omit<Section, "id"> = { title: "", subtitle: "", banner_image: "", display_order: 0 };
const EMPTY_ITEM: Omit<MerchandiseItem, "id"> = { name: "", description: "", image_url: "", images: "[]", section_id: null, display_order: 0 };

export default function AdminMerchandisePage() {
  const [auth, setAuth] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [items, setItems] = useState<MerchandiseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 섹션 폼
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [sectionForm, setSectionForm] = useState(EMPTY_SECTION);

  // 상품 폼
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState(EMPTY_ITEM);
  const [itemImages, setItemImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const load = useCallback(async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        fetch("/api/merchandise/sections"),
        fetch("/api/merchandise"),
      ]);
      const [sData, iData] = await Promise.all([sRes.json(), iRes.json()]);
      setSections(Array.isArray(sData) ? sData : []);
      setItems(Array.isArray(iData) ? iData : []);
    } catch { setSections([]); setItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("adminAuth") === "ydp12000") setAuth(true);
      else window.location.href = "/admin";
    }
  }, []);

  useEffect(() => { if (auth) load(); }, [auth, load]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: "section" | "item") {
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
      if (target === "section") setSectionForm(f => ({ ...f, banner_image: url }));
      else setItemForm(f => ({ ...f, image_url: url }));
    } catch (err) {
      alert('이미지 업로드에 실패했습니다.');
      console.error(err);
    } finally { setUploading(false); }
  }

  // 섹션 저장
  async function handleSaveSection() {
    setSaving(true);
    try {
      const url = editingSectionId !== null ? `/api/merchandise/sections/${editingSectionId}` : "/api/merchandise/sections";
      await fetch(url, { method: editingSectionId !== null ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sectionForm) });
      await load();
      setShowSectionForm(false);
    } finally { setSaving(false); }
  }

  // 상품 저장
  async function handleSaveItem() {
    setSaving(true);
    try {
      const payload = { ...itemForm, images: JSON.stringify(itemImages) };
      const url = editingItemId !== null ? `/api/merchandise/${editingItemId}` : "/api/merchandise";
      await fetch(url, { method: editingItemId !== null ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      await load();
      setShowItemForm(false);
    } finally { setSaving(false); }
  }

  async function handleDeleteSection(id: number) {
    if (!confirm("섹션과 해당 섹션의 상품이 모두 삭제됩니다. 계속하시겠습니까?")) return;
    await fetch(`/api/merchandise/sections/${id}`, { method: "DELETE" });
    await load();
  }

  async function handleDeleteItem(id: number) {
    if (!confirm("삭제하시겠습니까?")) return;
    await fetch(`/api/merchandise/${id}`, { method: "DELETE" });
    await load();
  }

  function toggleSection(id: number) {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const itemsBySection = (sectionId: number) => items.filter(i => i.section_id === sectionId);
  const unsortedItems = items.filter(i => i.section_id === null);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#000000]">굿즈 관리</h1>
        <div className="flex gap-2">
          <button onClick={() => { setEditingSectionId(null); setSectionForm({ ...EMPTY_SECTION, display_order: sections.length }); setShowSectionForm(true); }}
            className="flex items-center gap-2 rounded-full border border-[#000000] px-4 py-2.5 text-sm font-medium text-[#000000] transition-opacity hover:opacity-70">
            <ImageIcon size={14} /> 배너 추가
          </button>
          <button onClick={() => { setEditingItemId(null); setItemForm({ ...EMPTY_ITEM, display_order: items.length }); setItemImages([]); setShowItemForm(true); }}
            className="flex items-center gap-2 rounded-full bg-[#000000] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80">
            <Plus size={14} /> 상품 추가
          </button>
        </div>
      </div>

      {/* 섹션 폼 */}
      {showSectionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#000000]">{editingSectionId !== null ? "배너 수정" : "새 배너"}</h2>
              <button onClick={() => setShowSectionForm(false)} className="text-[#666666] hover:text-[#000000]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">제목 (큰 텍스트)</label>
                <input type="text" value={sectionForm.title} onChange={e => setSectionForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">서브타이틀 (선택)</label>
                <input type="text" value={sectionForm.subtitle} onChange={e => setSectionForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">배너 이미지</label>
                <input type="file" accept="image/*" onChange={e => handleImageUpload(e, "section")} disabled={uploading}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none file:mr-3 file:file:border-0 file:bg-[#000000] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50" />
                {uploading && <p className="mt-1 text-xs text-[#666666]">업로드 중...</p>}
                {sectionForm.banner_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={sectionForm.banner_image} alt="preview" className="h-16 w-32 object-cover" />
                    <button type="button" onClick={() => setSectionForm(f => ({ ...f, banner_image: '' }))} className="text-xs text-red-500 hover:underline">삭제</button>
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">순서</label>
                <input type="number" value={sectionForm.display_order} onChange={e => setSectionForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSaveSection} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#000000] py-3 text-sm font-medium text-white disabled:opacity-50 hover:opacity-80">
                <Check size={15} />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={() => setShowSectionForm(false)} className="flex-1 rounded-full border border-black py-3 text-sm font-medium text-[#666666] hover:border-[#000000]">취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 상품 폼 */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#000000]">{editingItemId !== null ? "상품 수정" : "새 상품"}</h2>
              <button onClick={() => setShowItemForm(false)} className="text-[#666666] hover:text-[#000000]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">상품명</label>
                <input type="text" value={itemForm.name} onChange={e => setItemForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">설명</label>
                <textarea rows={2} value={itemForm.description} onChange={e => setItemForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full resize-none border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">섹션 (배너)</label>
                <select value={itemForm.section_id ?? ""} onChange={e => setItemForm(f => ({ ...f, section_id: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]">
                  <option value="">섹션 없음</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">상품 이미지 (최대 4장)</label>
                <input type="file" accept="image/*" multiple onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (itemImages.length + files.length > 4) { alert('이미지는 최대 4장까지 등록 가능합니다.'); return; }
                  setUploading(true);
                  try {
                    const { resizeImage } = await import('@/lib/resizeImage');
                    const urls: string[] = [];
                    for (const file of files) {
                      if (!file.type.startsWith('image/')) continue;
                      const resized = await resizeImage(file);
                      const formData = new FormData();
                      formData.append('file', resized);
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      if (!res.ok) continue;
                      const { url } = await res.json();
                      urls.push(url);
                    }
                    setItemImages(prev => [...prev, ...urls].slice(0, 4));
                  } catch { alert('업로드 실패'); }
                  finally { setUploading(false); }
                }} disabled={uploading || itemImages.length >= 4}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none file:mr-3 file:file:border-0 file:bg-[#000000] file:px-3 file:py-1 file:text-xs file:text-white file:cursor-pointer disabled:opacity-50" />
                {uploading && <p className="mt-1 text-xs text-[#666666]">업로드 중...</p>}
                {itemImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {itemImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt={`img ${idx}`} className="h-20 w-full object-cover" />
                        <button type="button" onClick={() => setItemImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        {idx === 0 && <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-[9px] text-white">대표</span>}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-[11px] text-[#666666]">첫 번째 이미지가 대표 이미지로 사용됩니다. ({itemImages.length}/4)</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#666666]">순서</label>
                <input type="number" value={itemForm.display_order} onChange={e => setItemForm(f => ({ ...f, display_order: Number(e.target.value) }))}
                  className="w-full border border-black bg-[#F5F5F5] px-4 py-2.5 text-sm outline-none focus:border-[#000000]" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSaveItem} disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#000000] py-3 text-sm font-medium text-white disabled:opacity-50 hover:opacity-80">
                <Check size={15} />{saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={() => setShowItemForm(false)} className="flex-1 rounded-full border border-black py-3 text-sm font-medium text-[#666666] hover:border-[#000000]">취소</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-sm text-[#666666]">불러오는 중...</p> : (
        <div className="space-y-4">
          {sections.length === 0 && items.length === 0 && (
            <p className="text-sm text-[#666666]">등록된 배너와 상품이 없습니다. 배너를 먼저 추가하세요.</p>
          )}

          {/* 섹션별 목록 */}
          {sections.map(section => (
            <div key={section.id} className="bg-white shadow-sm overflow-hidden">
              {/* 배너 헤더 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0ebe3]">
                <div className="flex items-center gap-3">
                  {section.banner_image && (
                    <img src={section.banner_image} alt={section.title} className="h-10 w-16 object-cover" />
                  )}
                  <div>
                    <p className="font-bold text-[#000000]">{section.title}</p>
                    {section.subtitle && <p className="text-xs text-[#666666]">{section.subtitle}</p>}
                    <p className="text-xs text-[#666666]">상품 {itemsBySection(section.id).length}개</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingSectionId(section.id); setSectionForm({ title: section.title, subtitle: section.subtitle ?? "", banner_image: section.banner_image ?? "", display_order: section.display_order }); setShowSectionForm(true); }}
                    className="border border-black p-2 text-[#666666] hover:border-[#000000] hover:text-[#000000]"><Pencil size={14} /></button>
                  <button onClick={() => handleDeleteSection(section.id)}
                    className="border border-black p-2 text-[#666666] hover:border-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                  <button onClick={() => toggleSection(section.id)}
                    className="border border-black p-2 text-[#666666]">
                    {expandedSections.has(section.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* 섹션 상품 목록 */}
              {expandedSections.has(section.id) && (
                <div className="p-4">
                  {itemsBySection(section.id).length === 0 ? (
                    <p className="text-center text-xs text-[#666666] py-4">이 섹션에 상품이 없습니다.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {itemsBySection(section.id).map(item => (
                        <div key={item.id} className="border border-[#f0ebe3] overflow-hidden">
                          {item.image_url ? (
                            <div className="relative h-32">
                              <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="h-32 bg-[#F5F5F5] flex items-center justify-center">
                              <span className="text-xs text-[#666666]">이미지 없음</span>
                            </div>
                          )}
                          <div className="p-3">
                            <p className="text-xs font-bold text-[#000000] truncate">{item.name}</p>
                            <div className="mt-2 flex gap-1">
                              <button onClick={() => { setEditingItemId(item.id); setItemForm({ name: item.name, description: item.description ?? "", image_url: item.image_url ?? "", images: item.images ?? "[]", section_id: item.section_id, display_order: item.display_order }); try { setItemImages(JSON.parse(item.images || "[]")); } catch { setItemImages([]); } setShowItemForm(true); }}
                                className="flex-1 border border-black py-1 text-[10px] text-[#666666] hover:border-[#000000]">수정</button>
                              <button onClick={() => handleDeleteItem(item.id)}
                                className="flex-1 border border-black py-1 text-[10px] text-[#666666] hover:border-red-400 hover:text-red-500">삭제</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => { setEditingItemId(null); setItemForm({ ...EMPTY_ITEM, section_id: section.id, display_order: itemsBySection(section.id).length }); setItemImages([]); setShowItemForm(true); }}
                    className="mt-3 flex w-full items-center justify-center gap-1 border border-dashed border-black py-2.5 text-xs text-[#666666] hover:border-[#000000] hover:text-[#000000]">
                    <Plus size={12} /> 이 섹션에 상품 추가
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* 섹션 없는 상품 */}
          {unsortedItems.length > 0 && (
            <div className="bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0ebe3]">
                <p className="font-bold text-[#000000]">섹션 미지정 상품</p>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                {unsortedItems.map(item => (
                  <div key={item.id} className="border border-[#f0ebe3] overflow-hidden">
                    {item.image_url ? (
                      <div className="relative h-32">
                        <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-32 bg-[#F5F5F5] flex items-center justify-center">
                        <span className="text-xs text-[#666666]">이미지 없음</span>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-xs font-bold text-[#000000] truncate">{item.name}</p>
                      <div className="mt-2 flex gap-1">
                        <button onClick={() => { setEditingItemId(item.id); setItemForm({ name: item.name, description: item.description ?? "", image_url: item.image_url ?? "", images: item.images ?? "[]", section_id: item.section_id, display_order: item.display_order }); try { setItemImages(JSON.parse(item.images || "[]")); } catch { setItemImages([]); } setShowItemForm(true); }}
                          className="flex-1 border border-black py-1 text-[10px] text-[#666666] hover:border-[#000000]">수정</button>
                        <button onClick={() => handleDeleteItem(item.id)}
                          className="flex-1 border border-black py-1 text-[10px] text-[#666666] hover:border-red-400 hover:text-red-500">삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
