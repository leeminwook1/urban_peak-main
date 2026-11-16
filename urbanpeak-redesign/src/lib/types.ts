export const PROJECT_FORMATS=['Live','Sessions','Archive'] as const;
export const PROJECT_STATUSES=['예정','진행 중','종료','후속 작업 중','확인 중'] as const;
/** Detail-page fields, read from `info` by these labels. */
export const PROJECT_INFO_KEYS=['클라이언트 / 주최','기획 의도','핵심 컨셉','주요 콘텐츠','프로그램 구성','참여 인원 및 역할'] as const;

export type Project={
  id:number;
  title:string;
  format:string;
  status:string;
  /** Display date, e.g. "2026.08.17" or free text such as "진행일 확인 중". */
  date:string;
  /** ISO date used for sorting; null when the date is not confirmed. */
  sortDate:string|null;
  intro:string;
  images:string[];
  info:Record<string,string>;
  /** Optional note shown under the detail-page intro. */
  note:string;
  raw:string;
};

export type Person={name:string;role:string;subtitle:string;desc:string};
export type Part={name:string;desc:string};
export type Capability={name:string;parts:Part[]};
export type Step={name:string;desc:string};

export type SiteContent={
  intro:string;
  /** Project ids shown on the home page, in order (five cards). */
  homeProjects:number[];
  leadership:Person[];
  capabilities:Capability[];
  process:Step[];
};

export type Goods={id:number;name:string;description:string;images:string[]};
export type Merchandise={title:string;subtitle:string;banner:string;goods:Goods[]};

export type Docs={projects:Project[];content:SiteContent;merchandise:Merchandise};
export type DocKey=keyof Docs;
export const DOC_KEYS:DocKey[]=['projects','content','merchandise'];
export const isDocKey=(key:string):key is DocKey=>(DOC_KEYS as string[]).includes(key);
