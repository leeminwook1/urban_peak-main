"use client";

import {useEffect,useRef,useState} from 'react';
const file=(i:number)=>`hero-${String(i+1).padStart(2,'0')}`;

export default function Hero(){
  const [indices,setIndices]=useState([4,5]);
  const [active,setActive]=useState(0);
  const [count,setCount]=useState(4);
  const [paused,setPaused]=useState(false);
  const [reduced,setReduced]=useState(false);
  const refs=useRef<(HTMLVideoElement|null)[]>([]);
  const ready=useRef([false,false]);
  const switching=useRef(false);
  const transition=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const change=()=>setReduced(media.matches);
    media.addEventListener('change',change);
    return()=>{media.removeEventListener('change',change);if(transition.current)clearTimeout(transition.current)};
  },[]);
  useEffect(()=>{refs.current.forEach((v,i)=>{if(!v)return;v.muted=true;if(paused||reduced||i!==active)v.pause();else v.play().catch(()=>{})})},[active,paused,reduced]);
  useEffect(()=>{
    if(paused||reduced)return;
    const timer=setInterval(()=>{
      if(switching.current)return;
      const other=1-active;const video=refs.current[other];
      if(!video||!ready.current[other])return;
      switching.current=true;video.currentTime=0;video.muted=true;
      video.play().then(()=>{
        setActive(other);setCount(indices[other]);
        transition.current=setTimeout(()=>{
          refs.current[active]?.pause();ready.current[active]=false;
          setIndices(prev=>prev.map((n,i)=>i===active?(indices[other]+1)%12:n));
          switching.current=false;
        },1000);
      }).catch(()=>{switching.current=false});
    },6500);
    return()=>clearInterval(timer);
  },[active,indices,paused,reduced]);
  return <section className="hero-runway" data-scroll-scene aria-label="어반피크 영상 쇼릴">
    <div className="hero hero-stage">
      <div className="hero-media">
        <img className="hero-poster" src={`/images/frames/${file(count)}.jpg`} alt="어반피크 영상의 한 장면"/>
        {indices.map((n,i)=><video ref={el=>{refs.current[i]=el}} key={i} src={`/videos/${file(n)}.mp4`} poster={`/images/frames/${file(n)}.jpg`} className={i===active?'active':''} autoPlay={i===active&&!reduced&&!paused} muted playsInline loop preload="auto" onCanPlay={()=>{ready.current[i]=true}} onError={()=>{ready.current[i]=false}} aria-hidden="true"/>)}
      </div>
      <div className="hero-shade"/>
      <p className="hero-statement">새로운 장면을 만드는<br/>문화기획 스튜디오</p>
      <a className="hero-discover" href="#selected-projects">Explore our work <span>↗</span></a>
      <img className="hero-wordmark" src="/images/logos/logo-white.png" alt="urban peak" width="990" height="248"/>
      <div className="hero-meta"><span>OUR PROJECT <b>{String((count+8)%12+1).padStart(2,'0')}</b> / 12</span><a href="#intro">SCROLL TO EXPLORE ↓</a><button onClick={()=>setPaused(!paused)} aria-label={paused?'히어로 영상 재생':'히어로 영상 일시정지'}>{paused?'PLAY ▷':'PAUSE Ⅱ'}</button></div>
      <div className="hero-mist" aria-hidden="true"/>
    </div>
  </section>;
}
