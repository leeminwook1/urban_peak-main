"use client";

import {useState} from 'react';

export default function Login(){
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault();
    setBusy(true);setError('');
    const res=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
    if(res.ok){
      const next=new URLSearchParams(location.search).get('next');
      location.href=next&&next.startsWith('/admin')?next:'/admin';
      return;
    }
    setError((await res.json().catch(()=>({}))).error||'로그인하지 못했습니다.');
    setBusy(false);
  }

  return <main className="adm-login">
    <form onSubmit={submit}>
      <img src="/images/logos/logo-brand.png" alt="urban peak" width="990" height="248"/>
      <h1>관리자 로그인</h1>
      <label htmlFor="pw">비밀번호</label>
      <input id="pw" type="password" autoComplete="current-password" autoFocus required value={password} onChange={e=>setPassword(e.target.value)}/>
      {error&&<p className="adm-login-error" role="alert">{error}</p>}
      <button className="adm-btn is-primary" disabled={busy||!password}>{busy?'확인 중…':'로그인'}</button>
    </form>
  </main>;
}
