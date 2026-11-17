'use client';

import { useEffect, useState } from 'react';
import {
  ImageList,
  Loading,
  PageHead,
  RowTools,
  SaveBar,
  TextArea,
  TextInput,
  move,
  removeAt,
  replaceAt,
  useDoc,
} from '@/components/admin/kit';
import type { Capability, CrewMember, Person, Project, Step } from '@/lib/types';

const HOME_SLOTS = 5;

export default function ContentAdmin() {
  const doc = useDoc('content');
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    fetch('/api/admin/docs/projects')
      .then(r => r.json())
      .then(b => setProjects(b.data ?? []))
      .catch(() => {});
  }, []);

  if (!doc.data)
    return (
      <>
        <PageHead title="홈 · 스튜디오 · 크루" />
        <Loading error={doc.error} onRetry={doc.reload} />
      </>
    );
  const c = doc.data;
  const set = (patch: Partial<typeof c>) => doc.update(prev => ({ ...prev, ...patch }));
  const onError = (m: string) => doc.toast.show(m, 'error');

  const home = Array.from({ length: HOME_SLOTS }, (_, i) => c.homeProjects[i] ?? 0);
  const setHome = (i: number, id: number) => set({ homeProjects: replaceAt(home, i, id).filter(Boolean) });
  const setPerson = (i: number, p: Person) => set({ leadership: replaceAt(c.leadership, i, p) });
  const setMember = (i: number, m: CrewMember) => set({ crew: replaceAt(c.crew, i, m) });

  return (
    <>
      <PageHead title="홈 · 스튜디오 · 크루" desc="여러 페이지에 함께 쓰이는 문구와 목록입니다." />

      <nav className="adm-toc" aria-label="이 페이지 목차">
        <a href="#intro">소개 문구</a>
        <a href="#home">홈 대표 프로젝트</a>
        <a href="#leadership">리더십</a>
        <a href="#crew">크루</a>
        <a href="#capabilities">역량</a>
        <a href="#process">작업 방식</a>
      </nav>

      <section className="adm-panel" id="intro">
        <h2>
          스튜디오 소개 문구 <small>홈 · Studio 상단</small>
        </h2>
        <TextArea label="소개 문구" value={c.intro} onChange={intro => set({ intro })} rows={3} />
      </section>

      <section className="adm-panel" id="home">
        <h2>
          홈 대표 프로젝트 <small>홈 ‘OUR PROJECTS’ 카드 {HOME_SLOTS}개, 왼쪽부터 순서대로</small>
        </h2>
        <div className="adm-home-slots">
          {home.map((id, i) => {
            const p = projects.find(x => x.id === id);
            return (
              <div key={i} className="adm-slot">
                <div className="adm-slot-thumb">
                  {p?.images[0] ? (
                    <img src={p.images[0]} alt="" />
                  ) : (
                    <span>{p ? '사진 없음' : '비어 있음'}</span>
                  )}
                </div>
                <label htmlFor={'slot' + i}>{i + 1}번째</label>
                <select id={'slot' + i} value={id} onChange={e => setHome(i, Number(e.target.value))}>
                  <option value={0}>— 선택 안 함 —</option>
                  {projects.map(x => (
                    <option key={x.id} value={x.id} disabled={x.id !== id && home.includes(x.id)}>
                      {x.title}
                      {x.images.length ? '' : ' (사진 없음)'}
                    </option>
                  ))}
                </select>
                <div className="adm-row-tools">
                  <button
                    type="button"
                    onClick={() => set({ homeProjects: move(home, i, i - 1).filter(Boolean) })}
                    disabled={i === 0 || !id}
                    aria-label={`${i + 1}번째 왼쪽으로`}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => set({ homeProjects: move(home, i, i + 1).filter(Boolean) })}
                    disabled={i === HOME_SLOTS - 1 || !id}
                    aria-label={`${i + 1}번째 오른쪽으로`}
                  >
                    →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="adm-panel" id="leadership">
        <h2>
          리더십 <small>홈 · Crew 페이지 (사진은 Crew 페이지에 보입니다)</small>
        </h2>
        <div className="adm-rows">
          {c.leadership.map((p, i) => (
            <div className="adm-row-card has-photo" key={i}>
              <div className="adm-photo">
                <ImageList
                  value={p.photo ? [p.photo] : []}
                  max={1}
                  label="사진"
                  onChange={v => setPerson(i, { ...p, photo: v[0] ?? '' })}
                  onError={onError}
                />
              </div>
              <div className="adm-grid">
                <TextInput
                  label="이름"
                  required
                  value={p.name}
                  onChange={name => setPerson(i, { ...p, name })}
                />
                <TextInput
                  label="역할 (영문)"
                  value={p.role}
                  onChange={role => setPerson(i, { ...p, role })}
                />
                <TextInput
                  label="한글 직함 (선택)"
                  value={p.subtitle}
                  onChange={subtitle => setPerson(i, { ...p, subtitle })}
                  placeholder="예: 대표 · 크리에이티브 디렉터"
                />
                <TextArea
                  label="소개"
                  value={p.desc}
                  onChange={desc => setPerson(i, { ...p, desc })}
                  rows={2}
                />
              </div>
              <RowTools
                index={i}
                count={c.leadership.length}
                label={p.name || '이 사람'}
                onMove={to => set({ leadership: move(c.leadership, i, to) })}
                onRemove={() => set({ leadership: removeAt(c.leadership, i) })}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="adm-btn"
          onClick={() =>
            set({
              leadership: [
                ...c.leadership,
                { name: '', role: '', subtitle: '', desc: '', photo: '' } satisfies Person,
              ],
            })
          }
        >
          + 사람 추가
        </button>
      </section>

      <section className="adm-panel" id="crew">
        <h2>
          크루 <small>Crew 페이지 ‘함께하는 크루’ · 비어 있으면 안내 문구가 보입니다</small>
        </h2>
        <div className="adm-rows">
          {c.crew.map((m, i) => (
            <div className="adm-row-card has-photo" key={i}>
              <div className="adm-photo">
                <ImageList
                  value={m.photo ? [m.photo] : []}
                  max={1}
                  label="사진"
                  onChange={v => setMember(i, { ...m, photo: v[0] ?? '' })}
                  onError={onError}
                />
              </div>
              <div className="adm-grid">
                <TextInput
                  label="이름"
                  required
                  value={m.name}
                  onChange={name => setMember(i, { ...m, name })}
                />
                <TextInput
                  label="분야"
                  value={m.field}
                  onChange={field => setMember(i, { ...m, field })}
                  placeholder="예: 사진 · 영상"
                />
                <TextArea
                  label="소개 (선택)"
                  value={m.desc}
                  onChange={desc => setMember(i, { ...m, desc })}
                  rows={2}
                />
              </div>
              <RowTools
                index={i}
                count={c.crew.length}
                label={m.name || '이 크루'}
                onMove={to => set({ crew: move(c.crew, i, to) })}
                onRemove={() => set({ crew: removeAt(c.crew, i) })}
              />
            </div>
          ))}
          {!c.crew.length && <p className="adm-hint">아직 등록된 크루가 없습니다.</p>}
        </div>
        <button
          type="button"
          className="adm-btn"
          onClick={() =>
            set({ crew: [...c.crew, { name: '', field: '', desc: '', photo: '' } satisfies CrewMember] })
          }
        >
          + 크루 추가
        </button>
      </section>

      <section className="adm-panel" id="capabilities">
        <h2>
          역량 <small>홈 가로 카드 · Studio ‘다른 분야, 하나의 방향’ (5개 권장)</small>
        </h2>
        <div className="adm-rows">
          {c.capabilities.map((cap, i) => {
            const setCap = (next: Capability) => set({ capabilities: replaceAt(c.capabilities, i, next) });
            return (
              <div className="adm-row-card" key={i}>
                <div>
                  <TextInput
                    label={`${i + 1}. 역량 이름`}
                    required
                    value={cap.name}
                    onChange={name => setCap({ ...cap, name })}
                  />
                  <div className="adm-subrows">
                    {cap.parts.map((part, j) => (
                      <div className="adm-subrow" key={j}>
                        <input
                          value={part.name}
                          placeholder="파트 이름"
                          aria-label="파트 이름"
                          onChange={e =>
                            setCap({
                              ...cap,
                              parts: replaceAt(cap.parts, j, { ...part, name: e.target.value }),
                            })
                          }
                        />
                        <input
                          value={part.desc}
                          placeholder="설명"
                          aria-label="파트 설명"
                          onChange={e =>
                            setCap({
                              ...cap,
                              parts: replaceAt(cap.parts, j, { ...part, desc: e.target.value }),
                            })
                          }
                        />
                        <RowTools
                          index={j}
                          count={cap.parts.length}
                          label={part.name || '파트'}
                          onMove={to => setCap({ ...cap, parts: move(cap.parts, j, to) })}
                          onRemove={() => setCap({ ...cap, parts: removeAt(cap.parts, j) })}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="adm-btn is-small"
                      onClick={() => setCap({ ...cap, parts: [...cap.parts, { name: '', desc: '' }] })}
                    >
                      + 파트 추가
                    </button>
                  </div>
                </div>
                <RowTools
                  index={i}
                  count={c.capabilities.length}
                  label={cap.name || '이 역량'}
                  onMove={to => set({ capabilities: move(c.capabilities, i, to) })}
                  onRemove={() => set({ capabilities: removeAt(c.capabilities, i) })}
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="adm-btn"
          onClick={() =>
            set({ capabilities: [...c.capabilities, { name: '', parts: [{ name: '', desc: '' }] }] })
          }
        >
          + 역량 추가
        </button>
      </section>

      <section className="adm-panel" id="process">
        <h2>
          작업 방식 <small>홈 ‘HOW WE WORK’ · Studio · 오른쪽 How we work 패널</small>
        </h2>
        <div className="adm-rows">
          {c.process.map((s, i) => (
            <div className="adm-subrow is-step" key={i}>
              <span className="adm-step-no">{String(i + 1).padStart(2, '0')}</span>
              <input
                value={s.name}
                placeholder="단계 이름"
                aria-label="단계 이름"
                onChange={e => set({ process: replaceAt(c.process, i, { ...s, name: e.target.value }) })}
              />
              <input
                value={s.desc}
                placeholder="설명"
                aria-label="단계 설명"
                onChange={e => set({ process: replaceAt(c.process, i, { ...s, desc: e.target.value }) })}
              />
              <RowTools
                index={i}
                count={c.process.length}
                label={s.name || '이 단계'}
                onMove={to => set({ process: move(c.process, i, to) })}
                onRemove={() => set({ process: removeAt(c.process, i) })}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="adm-btn"
          onClick={() => set({ process: [...c.process, { name: '', desc: '' } satisfies Step] })}
        >
          + 단계 추가
        </button>
      </section>

      <SaveBar doc={doc} previewPath="/" />
    </>
  );
}
