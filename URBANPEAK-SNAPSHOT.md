# Urban Peak 배포 코드 사본

원본: dmsyjs2539-sys/urbanpeak
원본 커밋: af91b41ddd89140e0eb19c8b3a3809bbcc48756b
사본 위치: urbanpeak-deployed-snapshot/

해당 커밋의 Vercel 배포 성공 상태를 확인했습니다. 기존 src/, public/, urbanpeak-redesign/는 변경하지 않았습니다. 루트 TypeScript 검사에 사본이 섞이지 않도록 tsconfig exclude에 사본 폴더만 추가했습니다.

.DS_Store만 제외하고 원본 Git 추적 파일을 보존했습니다. 환경변수 실값이나 로컬 문의 데이터는 포함하지 않았습니다. 이 브랜치는 코드 인수인계용이며 main 병합이나 운영 배포는 수행하지 않았습니다.

사본 폴더에서 npm ci, npm run build, npm run start 순서로 실행합니다. 메일 발송 등 운영 설정은 별도 확인이 필요합니다.
