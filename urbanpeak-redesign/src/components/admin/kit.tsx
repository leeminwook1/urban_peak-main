'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { resizeImage } from '@/lib/resizeImage';
import type { DocKey, Docs, ImageAlts } from '@/lib/types';

/* ---------- data ---------- */

type DocState<K extends DocKey> = {
  data: Docs[K] | null;
  updatedAt: string | null;
  mode: string;
  error: string;
};

/** Loads one document, tracks unsaved edits, saves with a conflict check, previews, warns before leaving. */
export function useDoc<K extends DocKey>(key: K) {
  const [state, setState] = useState<DocState<K>>({ data: null, updatedAt: null, mode: '', error: '' });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const show = toast.show;

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/docs/${key}`, { cache: 'no-store' });
    const body = await res.json().catch(() => ({ error: '응답을 읽지 못했습니다.' }));
    if (res.status === 401) {
      location.href = '/admin/login?next=' + encodeURIComponent(location.pathname);
      return;
    }
    setState(
      res.ok
        ? { data: body.data, updatedAt: body.updatedAt, mode: body.mode, error: '' }
        : { data: null, updatedAt: null, mode: '', error: body.error },
    );
    setDirty(false);
  }, [key]);
  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback((next: Docs[K] | ((prev: Docs[K]) => Docs[K])) => {
    setState(s =>
      s.data === null
        ? s
        : { ...s, data: typeof next === 'function' ? (next as (p: Docs[K]) => Docs[K])(s.data) : next },
    );
    setDirty(true);
  }, []);

  const save = useCallback(async () => {
    if (!state.data || saving) return false;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/docs/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: state.data, baseUpdatedAt: state.updatedAt }),
      });
      const body = await res.json().catch(() => ({ error: '응답을 읽지 못했습니다.' }));
      if (!res.ok) {
        show(body.error || '저장에 실패했습니다.', 'error');
        return false;
      }
      setState(s => ({ ...s, data: body.data, updatedAt: body.updatedAt }));
      setDirty(false);
      show('저장했습니다. 사이트에 바로 반영됩니다.', 'ok');
      return true;
    } catch {
      show('네트워크 오류로 저장하지 못했습니다.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [key, state.data, state.updatedAt, saving, show]);

  /** Opens the site in a new tab showing the current (unsaved) edits. */
  const preview = useCallback(
    async (path: string) => {
      if (!state.data) return;
      const tab = window.open('about:blank', '_blank');
      const res = await fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data: state.data, path }),
      }).catch(() => null);
      const body = res ? await res.json().catch(() => ({})) : {};
      if (!res?.ok) {
        tab?.close();
        show(body.error || '미리보기를 열지 못했습니다.', 'error');
        return;
      }
      if (tab) tab.location.href = body.url;
      else location.href = body.url;
    },
    [key, state.data, show],
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty) save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, save]);

  return { ...state, key, update, save, preview, saving, dirty, reload: load, toast };
}
export type Doc<K extends DocKey> = ReturnType<typeof useDoc<K>>;

/* ---------- toast ---------- */

type Toast = { text: string; tone: 'ok' | 'error' } | null;
export function useToast() {
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string, tone: 'ok' | 'error' = 'ok') => {
    setToast({ text, tone });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), tone === 'error' ? 6000 : 3000);
  }, []);
  return { toast, show };
}
export function ToastView({ toast }: { toast: Toast }) {
  return (
    <div className="adm-toast-wrap" role="status" aria-live="polite">
      {toast && <div className={`adm-toast is-${toast.tone}`}>{toast.text}</div>}
    </div>
  );
}

/* ---------- layout pieces ---------- */

export function PageHead({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="adm-page-head">
      <div>
        <h1>{title}</h1>
        {desc && <p>{desc}</p>}
      </div>
      {children && <div className="adm-head-actions">{children}</div>}
    </header>
  );
}

/** Bottom bar: save state, history, preview and save. */
export function SaveBar<K extends DocKey>({ doc, previewPath }: { doc: Doc<K>; previewPath: string }) {
  const [history, setHistory] = useState(false);
  return (
    <>
      <div className={`adm-savebar ${doc.dirty ? 'is-dirty' : ''}`}>
        <span className="adm-savebar-state">
          {doc.saving
            ? '저장 중…'
            : doc.dirty
              ? '저장하지 않은 변경 사항이 있습니다.'
              : '모두 저장되었습니다.'}
        </span>
        <div>
          <button type="button" className="adm-btn is-ghost" onClick={() => setHistory(true)}>
            저장 이력
          </button>
          {doc.dirty && (
            <button
              type="button"
              className="adm-btn is-ghost"
              onClick={() => {
                if (confirm('저장하지 않은 변경 사항을 버릴까요?')) doc.reload();
              }}
              disabled={doc.saving}
            >
              되돌리기
            </button>
          )}
          <button type="button" className="adm-btn" onClick={() => doc.preview(previewPath)}>
            미리보기
          </button>
          <button
            type="button"
            className="adm-btn is-primary"
            onClick={doc.save}
            disabled={!doc.dirty || doc.saving}
          >
            {doc.saving ? '저장 중…' : '저장하기'} <kbd>Ctrl S</kbd>
          </button>
        </div>
      </div>
      {history && <HistoryDialog doc={doc} onClose={() => setHistory(false)} />}
      <ToastView toast={doc.toast.toast} />
    </>
  );
}

type Version = { id: string; savedAt: string | null };
function HistoryDialog<K extends DocKey>({ doc, onClose }: { doc: Doc<K>; onClose: () => void }) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
    fetch(`/api/admin/docs/${doc.key}/history`)
      .then(r => r.json())
      .then(b => (b.versions ? setVersions(b.versions) : setError(b.error || '저장 이력을 읽지 못했습니다.')))
      .catch(() => setError('저장 이력을 읽지 못했습니다.'));
  }, [doc.key]);

  async function restore(v: Version) {
    const label = v.savedAt ? formatDate(v.savedAt) : '기본 데이터';
    if (!confirm(`${label} 버전을 편집 화면으로 불러올까요?\n‘저장하기’를 눌러야 사이트에 반영됩니다.`))
      return;
    setBusy(v.id);
    const body = await fetch(`/api/admin/docs/${doc.key}/history?id=${encodeURIComponent(v.id)}`)
      .then(r => r.json())
      .catch(() => ({}));
    setBusy('');
    if (!body.data) {
      setError(body.error || '버전을 불러오지 못했습니다.');
      return;
    }
    doc.update(body.data);
    doc.toast.show(`${label} 버전을 불러왔습니다. 확인 후 저장하세요.`);
    onClose();
  }

  return (
    <dialog ref={ref} className="adm-dialog" onClose={onClose} onCancel={onClose}>
      <header>
        <h2>저장 이력</h2>
        <button type="button" className="adm-icon" onClick={onClose} aria-label="닫기">
          ×
        </button>
      </header>
      <p className="adm-dialog-desc">이전 버전을 불러와 확인한 뒤 저장하면 그 버전으로 되돌릴 수 있습니다.</p>
      {error && <p className="adm-dialog-error">{error}</p>}
      {!versions && !error && <p className="adm-dialog-desc">불러오는 중…</p>}
      {versions && (
        <ol className="adm-versions">
          {versions.map((v, i) => (
            <li key={v.id}>
              <span>
                <strong>{v.savedAt ? formatDate(v.savedAt) : '기본 데이터'}</strong>
                <small>
                  {i === 0 && v.savedAt ? '현재 사이트에 반영된 버전' : v.savedAt ? '' : '처음 제공된 내용'}
                </small>
              </span>
              <button type="button" className="adm-btn is-small" onClick={() => restore(v)} disabled={!!busy}>
                {busy === v.id ? '불러오는 중…' : '불러오기'}
              </button>
            </li>
          ))}
        </ol>
      )}
    </dialog>
  );
}
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });

export function Loading({ error, onRetry }: { error: string; onRetry: () => void }) {
  return error ? (
    <div className="adm-empty is-error">
      <p>{error}</p>
      <button className="adm-btn" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  ) : (
    <div className="adm-empty">불러오는 중…</div>
  );
}

/* ---------- fields ---------- */

export function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string;
  hint?: string;
  children: (id: string) => React.ReactNode;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <div className={`adm-field ${wide ? 'is-wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children(id)}
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  hint,
  placeholder,
  wide,
  required,
  inputRef,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  wide?: boolean;
  required?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <Field label={label + (required ? ' *' : '')} hint={hint} wide={wide}>
      {id => (
        <input
          ref={inputRef}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          aria-invalid={required && !value.trim() ? true : undefined}
        />
      )}
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  placeholder,
  rows = 3,
  wide = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  rows?: number;
  wide?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight + 2, rows * 26) + 'px';
  }, [value, rows]);
  return (
    <Field label={label} hint={hint} wide={wide}>
      {id => (
        <textarea
          ref={ref}
          id={id}
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </Field>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  hint?: string;
}) {
  const list = options.includes(value) || !value ? options : [value, ...options];
  return (
    <Field label={label} hint={hint}>
      {id => (
        <select id={id} value={value} onChange={e => onChange(e.target.value)}>
          {list.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** Large tap-friendly choice buttons (used instead of a select for short option lists). */
export function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  const list = options.includes(value) || !value ? options : [value, ...options];
  return (
    <div className="adm-field is-wide" role="radiogroup" aria-label={label}>
      <span className="adm-field-label">{label}</span>
      <div className="adm-choice">
        {list.map(o => (
          <button key={o} type="button" role="radio" aria-checked={o === value} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- list helpers ---------- */

export const move = <T,>(list: T[], from: number, to: number) => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};
export const replaceAt = <T,>(list: T[], index: number, item: T) =>
  list.map((x, i) => (i === index ? item : x));
export const removeAt = <T,>(list: T[], index: number) => list.filter((_, i) => i !== index);

export function RowTools({
  index,
  count,
  onMove,
  onRemove,
  label,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="adm-row-tools">
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label={`${label} 위로`}
        title="위로"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label={`${label} 아래로`}
        title="아래로"
      >
        ↓
      </button>
      <button
        type="button"
        className="is-danger"
        onClick={() => {
          if (confirm(`${label}을(를) 삭제할까요?`)) onRemove();
        }}
        aria-label={`${label} 삭제`}
        title="삭제"
      >
        ×
      </button>
    </div>
  );
}

/* ---------- images ---------- */

async function upload(file: File) {
  const body = new FormData();
  body.append('file', await resizeImage(file, 2400, 2400, 0.86));
  const res = await fetch('/api/admin/upload', { method: 'POST', body });
  const data = await res.json().catch(() => ({ error: '업로드 응답을 읽지 못했습니다.' }));
  if (!res.ok) throw new Error(data.error || '업로드에 실패했습니다.');
  return data.url as string;
}

/** Upload (button, drag & drop or phone camera), reorder, set cover, alt text, remove. The first image is the cover. */
export function ImageList({
  value,
  onChange,
  onError,
  max,
  label = '이미지',
  alts,
  onAltsChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onError: (msg: string) => void;
  max?: number;
  label?: string;
  alts?: ImageAlts;
  onAltsChange?: (v: ImageAlts) => void;
}) {
  const [busy, setBusy] = useState(0);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const latest = useRef(value);
  latest.current = value;
  const single = max === 1;

  async function add(files: FileList | File[]) {
    const list = [...files].filter(f => f.type.startsWith('image/'));
    if (!list.length) return;
    const room = single ? 1 : max ? Math.max(0, max - latest.current.length) : list.length;
    if (!room) {
      onError(`${label}는 최대 ${max}장까지 올릴 수 있습니다.`);
      return;
    }
    const todo = list.slice(0, room);
    setBusy(n => n + todo.length);
    for (const file of todo) {
      try {
        const url = await upload(file);
        latest.current = single ? [url] : [...latest.current, url];
        onChange(latest.current);
      } catch (e) {
        onError(`${file.name}: ${e instanceof Error ? e.message : '업로드 실패'}`);
      } finally {
        setBusy(n => n - 1);
      }
    }
  }

  return (
    <div
      className={`adm-images ${over ? 'is-over' : ''} ${single ? 'is-single' : ''}`}
      onDragOver={e => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault();
        setOver(false);
        add(e.dataTransfer.files);
      }}
    >
      <div className="adm-image-grid">
        {value.map((src, i) => (
          <div key={src + i} className="adm-image-item">
            <figure className="adm-image">
              <img src={src} alt={alts?.[src] ?? ''} />
              {i === 0 && !single && <span className="adm-badge">대표</span>}
              <div className="adm-image-tools">
                {!single && (
                  <>
                    <button
                      type="button"
                      onClick={() => onChange(move(value, i, i - 1))}
                      disabled={i === 0}
                      title="앞으로"
                      aria-label="앞으로"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange(move(value, i, i + 1))}
                      disabled={i === value.length - 1}
                      title="뒤로"
                      aria-label="뒤로"
                    >
                      →
                    </button>
                    {i > 0 && (
                      <button type="button" onClick={() => onChange(move(value, i, 0))} title="대표 이미지로">
                        대표로
                      </button>
                    )}
                  </>
                )}
                {single && (
                  <button type="button" onClick={() => input.current?.click()}>
                    바꾸기
                  </button>
                )}
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => onChange(removeAt(value, i))}
                  title="삭제"
                  aria-label="삭제"
                >
                  ×
                </button>
              </div>
            </figure>
            {onAltsChange && (
              <input
                className="adm-alt"
                value={alts?.[src] ?? ''}
                placeholder="사진 설명 (선택)"
                aria-label={`${i + 1}번째 ${label} 설명`}
                onChange={e => onAltsChange({ ...alts, [src]: e.target.value })}
              />
            )}
          </div>
        ))}
        {Array.from({ length: busy }, (_, i) => (
          <div key={'busy' + i} className="adm-image is-busy">
            올리는 중…
          </div>
        ))}
        {(!max || value.length + busy < max) && (
          <button type="button" className="adm-image-add" onClick={() => input.current?.click()}>
            <strong>+ {label} 추가</strong>
            <span>사진 선택 · 촬영 · 끌어다 놓기</span>
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={!single}
        hidden
        onChange={e => {
          if (e.target.files) add(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
