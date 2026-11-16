import {NextResponse,type NextRequest} from 'next/server';
import {SESSION_COOKIE,verifySession} from './auth';

/** Route-handler guard (middleware also checks). Mutations must come from this site's own pages. */
export async function requireAdmin(req:NextRequest){
  if(!await verifySession(req.cookies.get(SESSION_COOKIE)?.value))return NextResponse.json({error:'로그인이 필요합니다.'},{status:401});
  if(req.method!=='GET'){
    const origin=req.headers.get('origin');
    if(origin&&new URL(origin).host!==req.headers.get('host'))return NextResponse.json({error:'허용되지 않은 요청입니다.'},{status:403});
  }
  return null;
}
