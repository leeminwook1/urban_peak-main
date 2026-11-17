'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loading, PageHead, ToastView, formatDate, useToast } from '@/components/admin/kit';
import type { Inquiry } from '@/lib/inquiries';

const FIELDS: [keyof Inquiry, string][] = [
  ['organization', '소속'],
  ['type', '문의 유형'],
  ['schedule', '희망 일정'],
  ['place', '장소 · 규모'],
  ['budget', '예산 범위'],
  ['reference', '참고 링크'],
];
const MAIL: Record<string, { label: string; tone: string }> = {
  sent: { label: '메일 발송됨', tone: 'is-ok' },
  failed: { label: '메일 발송 실패', tone: 'is-bad' },
  skipped: { label: '메일 미설정', tone: '' },
  pending: { label: '발송 대기', tone: '' },
};

export default function InquiriesAdmin() {
  const [list, setList] = useState<Inquiry[] | null>(null);
  const [mail, setMail] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [view, setView] = useState<'list' | 'edit'>('list');
  const toast = useToast();

  const load = useCallback(async () => {
    setError('');
    const res = await fetch('/api/admin/inquiries', { cache: 'no-store' });
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) {
      location.href = '/admin/login?next=/admin/inquiries';
      return;
    }
    if (!res.ok) return setError(body.error || '문의 목록을 읽지 못했습니다.');
    setList(body.inquiries);
    setMail(body.mail);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const shown = useMemo(() => (list ?? []).filter(i => filter === 'all' || !i.readAt), [list, filter]);
  const current = list?.find(i => i.id === selected) ?? null;
  const unread = (list ?? []).filter(i => !i.readAt).length;

  async function setRead(i: Inquiry, read: boolean) {
    const res = await fetch(`/api/admin/inquiries/${i.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.show(body.error || '상태를 바꾸지 못했습니다.', 'error');
    setList(l => l && l.map(x => (x.id === i.id ? { ...x, readAt: body.readAt } : x)));
  }
  function open(i: Inquiry) {
    setSelected(i.id);
    setView('edit');
    window.scrollTo({ top: 0 });
    if (!i.readAt) setRead(i, true);
  }
  async function remove(i: Inquiry) {
    if (!confirm(`${i.name}님의 문의를 삭제할까요? 삭제하면 되돌릴 수 없습니다.`)) return;
    const res = await fetch(`/api/admin/inquiries/${i.id}`, { method: 'DELETE' });
    if (!res.ok) return toast.show('삭제하지 못했습니다.', 'error');
    setList(l => l && l.filter(x => x.id !== i.id));
    setSelected(null);
    setView('list');
    toast.show('삭제했습니다.');
  }

  if (!list)
    return (
      <>
        <PageHead title="문의함" />
        <Loading error={error} onRetry={load} />
      </>
    );

  const replySubject = current
    ? encodeURIComponent(`Re: [어반피크] ${current.type || '문의'} 답변드립니다`)
    : '';

  return (
    <>
      <PageHead
        title="문의함"
        desc={`사이트 Contact 폼으로 들어온 문의입니다.${unread ? ` 읽지 않은 문의 ${unread}건.` : ''}`}
      >
        <button className="adm-btn" onClick={load}>
          새로고침
        </button>
      </PageHead>

      {!mail && (
        <p className="adm-callout">
          메일 발송이 아직 설정되지 않았습니다. 문의는 이곳에 모두 저장되며, 설정 후에는 새 문의가 메일로도
          전달됩니다.
        </p>
      )}

      <div className="adm-split" data-view={view}>
        <div className="adm-list">
          <div className="adm-choice" role="radiogroup" aria-label="보기">
            <button
              type="button"
              role="radio"
              aria-checked={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              전체 {list.length}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              안 읽음 {unread}
            </button>
          </div>
          <ol>
            {shown.map(i => (
              <li
                key={i.id}
                className={`${i.id === current?.id ? 'is-active' : ''} ${i.readAt ? '' : 'is-unread'}`}
              >
                <button type="button" className="adm-list-item adm-inquiry-item" onClick={() => open(i)}>
                  <span>
                    <strong>
                      {!i.readAt && <i className="adm-dot" aria-label="안 읽음" />}
                      {i.name}
                      {i.type && <em> · {i.type}</em>}
                    </strong>
                    <small>{i.message.slice(0, 60)}</small>
                    <small>{formatDate(i.createdAt)}</small>
                  </span>
                </button>
              </li>
            ))}
            {!shown.length && (
              <li className="adm-list-empty">
                {filter === 'unread' ? '읽지 않은 문의가 없습니다.' : '아직 문의가 없습니다.'}
              </li>
            )}
          </ol>
        </div>

        {current ? (
          <div className="adm-editor">
            <div className="adm-editor-head">
              <button type="button" className="adm-btn is-ghost adm-back" onClick={() => setView('list')}>
                ← 목록
              </button>
              <span className={`adm-pill ${MAIL[current.mailStatus]?.tone ?? ''}`} title={current.mailError}>
                {MAIL[current.mailStatus]?.label ?? current.mailStatus}
              </span>
              <button
                type="button"
                className="adm-btn is-ghost"
                onClick={() => setRead(current, !current.readAt)}
              >
                {current.readAt ? '안 읽음으로 표시' : '읽음으로 표시'}
              </button>
              <button type="button" className="adm-btn is-danger" onClick={() => remove(current)}>
                삭제
              </button>
            </div>
            <section className="adm-panel adm-inquiry">
              <h2>{current.name}</h2>
              <p className="adm-inquiry-meta">
                <a href={`mailto:${current.email}`}>{current.email}</a> · {formatDate(current.createdAt)}
              </p>
              <dl>
                {FIELDS.filter(([k]) => current[k]).map(([k, label]) => (
                  <div key={k}>
                    <dt>{label}</dt>
                    <dd>
                      {k === 'reference' ? (
                        <a href={current.reference} target="_blank" rel="noreferrer noopener">
                          {current.reference}
                        </a>
                      ) : (
                        current[k]
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <h3>문의 내용</h3>
              <p className="adm-inquiry-message">{current.message}</p>
              <a className="adm-btn is-primary" href={`mailto:${current.email}?subject=${replySubject}`}>
                메일로 답장하기
              </a>
              {current.mailStatus === 'failed' && current.mailError && (
                <p className="adm-hint">메일 발송 오류: {current.mailError}</p>
              )}
            </section>
          </div>
        ) : (
          <div className="adm-empty adm-editor">왼쪽에서 문의를 선택하세요.</div>
        )}
      </div>
      <ToastView toast={toast.toast} />
    </>
  );
}
