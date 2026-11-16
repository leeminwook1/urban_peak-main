import {NextResponse,type NextRequest} from 'next/server';
import {SESSION_COOKIE,SESSION_MAX_AGE,adminConfigured,checkPassword,createSession} from '@/lib/auth';

export async function POST(req:NextRequest){
  if(!adminConfigured())return NextResponse.json({error:'관리자 비밀번호(ADMIN_PASSWORD)가 설정되지 않아 로그인할 수 없습니다.'},{status:503});
  const body=await req.json().catch(()=>({})) as {password?:unknown};
  if(typeof body.password!=='string'||!await checkPassword(body.password)){
    await new Promise(r=>setTimeout(r,600));
    return NextResponse.json({error:'비밀번호가 올바르지 않습니다.'},{status:401});
  }
  const res=NextResponse.json({ok:true});
  res.cookies.set(SESSION_COOKIE,await createSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:SESSION_MAX_AGE});
  return res;
}
