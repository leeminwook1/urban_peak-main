# 문의 메일 발송: 가비아 DNS 설정 (Resend 도메인 인증)

urbanpeak.co.kr의 Contact 폼으로 문의가 들어오면 `urbanpeak2020@gmail.com`으로 알림 메일을 보내도록 되어 있습니다.
메일은 Resend로 보내는데, **`urbanpeak.co.kr` 도메인 인증이 끝나야 실제로 발송됩니다.**
도메인 DNS는 가비아에서 관리하므로, **가비아 계정 주인이 아래 레코드 3개를 추가**해야 합니다.

> 인증 전에도 문의는 사라지지 않습니다. 관리자 문의함(https://urbanpeak.co.kr/admin/inquiries)에 저장되고,
> 메일 상태만 "메일 발송 실패 (The urbanpeak.co.kr domain is not verified …)"로 표시됩니다.

## 현재 상태 (2026-11-18 기준)

| 항목 | 상태 |
|---|---|
| Resend 설치 | 완료 (Vercel 마켓플레이스, 무료 요금제, 지역 `us-east-1`) |
| `RESEND_API_KEY` | Vercel 프로젝트 `urban-peak-main`에 자동 등록됨 |
| `CONTACT_FROM` | `Urban Peak <noreply@urbanpeak.co.kr>` (운영·미리보기) |
| `CONTACT_TO` | `urbanpeak2020@gmail.com` (운영·미리보기) |
| Resend 도메인 | `urbanpeak.co.kr` 등록됨, **인증 전(`not_started`)** |
| Resend 도메인 ID | `ac921b1d-1c1e-452c-94b2-900dca974da1` |
| DNS 관리 | 가비아 (`ns1.gabia.co.kr`) |

코드 수정이나 재배포는 필요 없습니다. **DNS 레코드만 추가되면 그 다음 문의부터 메일이 나갑니다.**

## 1. 가비아에서 추가할 레코드

가비아 로그인 → My가비아 → 도메인 → `urbanpeak.co.kr`의 **DNS 관리(DNS 설정)** → 레코드 추가

| 타입 | 호스트 | 값/위치 | TTL |
|---|---|---|---|
| TXT | `resend._domainkey` | 아래 DKIM 값 (한 줄 전체) | 기본값 |
| CNAME | `send` | `send.forge.rmta.net.` | 기본값 |
| CNAME | `rsend` | `rsend.forge.rmta.net.` | 기본값 |

DKIM 값 (TXT `resend._domainkey`):

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgXbVN5cxGP5a/rABh/MnMs7JBmgDChplBNUXd6tz+JbMAqeZwH8DuHaoAh+kAMKkT3r6eKAVNPQML77RwVyyxPt97+kinyuEv8rp2WmZCew+L2dqQcW4LTEo4XJB0tvwS/diouuE+9xWt2JIavV7Sr2wIznm24jSpmPRVDg1mEwIDAQAB
```

입력할 때 주의할 점

- **호스트**에는 `urbanpeak.co.kr`을 빼고 위의 앞부분만 넣습니다 (예: `send`).
- **CNAME 값** 끝의 점(`.`)은 가비아 입력란이 요구하면 붙이고, 자동으로 붙여 주면 빼도 됩니다.
- **TXT 값**은 공백·줄바꿈 없이 한 줄 그대로 붙여 넣습니다. 따옴표가 자동으로 붙는 것은 괜찮습니다.
- 2026-11-17에 확인했을 때 이 이름들에는 기존 레코드가 없었고, 루트 도메인에 MX(메일 수신) 설정도 없어서 기존 설정과 충돌하지 않습니다.
- 레코드 값은 Resend가 발급한 것입니다. 혹시 Resend에서 도메인을 다시 등록했다면 아래 "레코드 값 다시 확인"으로 최신 값을 받아 쓰세요.

## 2. 반영 확인 (DNS 추가 후)

DNS 반영에는 보통 몇 분, 길게는 몇 시간이 걸립니다.

### 2-1. DNS가 퍼졌는지 확인

```bash
curl -s "https://dns.google/resolve?name=resend._domainkey.urbanpeak.co.kr&type=TXT"
curl -s "https://dns.google/resolve?name=send.urbanpeak.co.kr&type=CNAME"
curl -s "https://dns.google/resolve?name=rsend.urbanpeak.co.kr&type=CNAME"
```

각 응답에 `"Answer"`가 있고 위 표의 값이 보이면 반영된 것입니다.

### 2-2. Resend에 인증 요청 및 상태 확인

`RESEND_API_KEY`는 Vercel에서 받아 씁니다. 키 값은 파일에 남기지 말고 쓰고 나서 지웁니다.

```bash
# Vercel 로그인 (처음 한 번): 표시되는 링크를 브라우저에서 승인
npx vercel@latest login
# 저장소의 urbanpeak-redesign 폴더에서 프로젝트 연결 후 개발용 환경 변수를 임시 파일로 받기
cd urbanpeak-redesign
npx vercel@latest link --yes --project urban-peak-main
npx vercel@latest env pull ../.env.tmp-dev --environment=development --yes
```

```bash
KEY=$(grep '^RESEND_API_KEY=' ../.env.tmp-dev | cut -d= -f2- | tr -d '"')
DOMAIN_ID=ac921b1d-1c1e-452c-94b2-900dca974da1
# 인증 요청
curl -s -X POST -H "Authorization: Bearer $KEY" https://api.resend.com/domains/$DOMAIN_ID/verify
# 상태 확인: "status":"verified" 가 되면 완료 (pending 이면 몇 분 뒤 다시 확인)
curl -s -H "Authorization: Bearer $KEY" https://api.resend.com/domains/$DOMAIN_ID
rm -f ../.env.tmp-dev
```

Windows Git Bash에서 `npx vercel api /v9/...`처럼 `/`로 시작하는 인자를 쓰는 명령은 경로가 바뀌어 실패할 수 있으니
앞에 `MSYS_NO_PATHCONV=1`을 붙입니다.

### 2-3. 실제 발송 테스트

1. https://urbanpeak.co.kr/contact 에서 테스트 문의를 남깁니다 (이름에 "테스트"라고 표시).
2. `urbanpeak2020@gmail.com`에 `[어반피크 문의] …` 메일이 오는지 확인합니다. 처음에는 스팸함도 확인하세요.
3. 관리자 문의함에서 해당 문의의 상태가 **"메일 발송됨"**인지 확인한 뒤, 테스트 문의는 삭제합니다.

## 레코드 값 다시 확인

```bash
curl -s -H "Authorization: Bearer $KEY" https://api.resend.com/domains/ac921b1d-1c1e-452c-94b2-900dca974da1
```

응답의 `records` 배열에 있는 `type`, `name`, `value`가 가비아에 넣을 값입니다.

## 참고: 관련 코드와 설정

| 위치 | 내용 |
|---|---|
| `urbanpeak-redesign/src/app/api/contact/route.ts` | 문의 검증 → DB 저장 → 메일 발송 → 발송 상태 기록 |
| `urbanpeak-redesign/src/lib/inquiry-mail.ts` | Resend 발송 (보내는 주소 `CONTACT_FROM`, 받는 주소 `CONTACT_TO`) |
| `urbanpeak-redesign/src/lib/inquiries.ts` | 문의 저장 (`inquiries` 테이블) |
| `urbanpeak-redesign/src/app/admin/inquiries/page.tsx` | 관리자 문의함 |
| Vercel 프로젝트 `urban-peak-main` | 루트 폴더 `urbanpeak-redesign`, 환경 변수 `RESEND_API_KEY`·`CONTACT_FROM`·`CONTACT_TO` |

- 받는 주소를 바꾸려면 Vercel 환경 변수 `CONTACT_TO`만 바꾸고 재배포하면 됩니다.
- 도메인 인증 전에는 Resend가 계정 소유자 이메일(Vercel 계정 메일)로만 보낼 수 있습니다. 급하면 `CONTACT_FROM`을 `Urban Peak <onboarding@resend.dev>`, `CONTACT_TO`를 그 계정 메일로 임시로 바꾸는 방법도 있습니다.
