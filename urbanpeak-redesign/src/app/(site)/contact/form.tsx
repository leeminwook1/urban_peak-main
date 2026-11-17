'use client';
import { useState } from 'react';
export default function ContactForm({ disabled = false }: { disabled?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || done || disabled) return;
    const form = e.currentTarget;
    setBusy(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '문의 접수에 실패했습니다.');
      setStatus('문의가 접수되었습니다. 담당자가 확인한 뒤 남겨주신 이메일로 연락드리겠습니다.');
      setDone(true);
      form.reset();
    } catch (e) {
      setStatus(
        e instanceof Error
          ? e.message
          : '연결에 실패했습니다. 잠시 후 다시 시도하거나 이메일을 이용해 주세요.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        이름 / NAME *<input name="name" required maxLength={100} autoComplete="name" />
      </label>
      <label className="field">
        이메일 / EMAIL *<input name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label className="field">
        소속 / ORGANIZATION <small>선택</small>
        <input name="organization" maxLength={150} autoComplete="organization" />
      </label>
      <fieldset className="contact-type-options">
        <legend>
          문의 유형 <small>선택</small>
        </legend>
        <div>
          {['프로젝트 의뢰', '공동기획', '크루 참여', '기타'].map(x => (
            <label key={x}>
              <input type="radio" name="type" value={x} />
              <span>{x}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">
        희망 일정 <small>선택</small>
        <input name="schedule" maxLength={200} placeholder="예: 2027년 3월 / 협의 가능" />
      </label>
      <label className="field">
        장소 · 규모 <small>선택</small>
        <input name="place" maxLength={200} placeholder="장소, 참여 인원 등" />
      </label>
      <label className="field">
        예산 범위 <small>선택</small>
        <select name="budget" defaultValue="">
          <option value="">선택해 주세요</option>
          {[
            '미정',
            '500만원 미만',
            '500만–1,000만원',
            '1,000만–3,000만원',
            '3,000만–5,000만원',
            '5,000만원 이상',
            '별도 협의',
          ].map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="field">
        참고 링크 <small>선택</small>
        <input name="reference" type="url" maxLength={2000} placeholder="https://" />
      </label>
      <label className="field wide">
        이야기하고 싶은 내용 / MESSAGE *
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={10000}
          placeholder="프로젝트의 목적과 함께 만들고 싶은 경험을 알려주세요. (10자 이상)"
        />
      </label>
      <label className="honey" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="consent">
        <input name="consent" type="checkbox" required value="yes" />
        <span>
          문의 응대를 위해 이름·이메일·작성 내용을 수집하고 서버에 저장하는 데 동의합니다. 동의를 거부하면 폼
          접수가 제한됩니다.
        </span>
      </label>
      <div className="form-actions">
        <button type="submit" disabled={busy || done || disabled}>
          {disabled ? '문의 양식 준비 중' : busy ? '접수 중…' : done ? '접수됨' : '문의 접수하기 ↗'}
        </button>
      </div>
      {status && (
        <p className="form-status" role="status" aria-live="polite">
          {status}
        </p>
      )}
    </form>
  );
}
