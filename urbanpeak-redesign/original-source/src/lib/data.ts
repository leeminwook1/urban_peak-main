export interface Project {
  id: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  symbol_url: string;
  image_url?: string | null;
  display_order: number;
}

export interface TeamMember {
  id: string;
  role: string;
  name: string;
  description: string;
  display_order: number;
}

export const defaultProjects: Project[] = [
  {
    id: "1",
    tag: "기획안 01",
    title: "Signal from Small Stages",
    category: "LIVE CURATION / PILOT FORMAT",
    description:
      "작은 공간에서 다시 시작하는 인디 공연 시리즈. 사라진 소극장의 감도를 현재의 동선으로 다시 번역합니다.",
    symbol_url: "/images/logos/symbol-orange.png",
    display_order: 0,
  },
  {
    id: "2",
    tag: "기획안 02",
    title: "Urban Peak Night Shift",
    category: "NIGHT PROGRAM / SEASONAL SHOWCASE",
    description:
      "음악, 퍼포먼스, 대화가 느슨하게 이어지는 야간형 큐레이션 포맷. 도시적인 긴장감과 취향의 밀도를 담습니다.",
    symbol_url: "/images/logos/symbol-teal.png",
    display_order: 1,
  },
  {
    id: "3",
    tag: "기획안 03",
    title: "Open Scene Casting",
    category: "CREATIVE CASTING / OPEN CALL CONCEPT",
    description:
      "새로운 팀과 실험적인 무대를 연결하는 프로젝트. 다양한 장르가 자연스럽게 섞이는 구조를 지향합니다.",
    symbol_url: "/images/logos/symbol-black.png",
    display_order: 2,
  },
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    role: "CREATIVE DIRECTOR",
    name: "김선우",
    description:
      "공간과 무대 흐름을 설계하며 어반피크의 전체 톤을 이끕니다.",
    display_order: 0,
  },
  {
    id: "2",
    role: "VISUAL PLANNER",
    name: "이하린",
    description:
      "시각 장면과 아카이브 방향을 잡아 프로젝트에 밀도를 더합니다.",
    display_order: 1,
  },
  {
    id: "3",
    role: "CASTING CURATOR",
    name: "박지오",
    description:
      "아티스트와 팀을 연결해 프로젝트마다 새로운 조합을 만듭니다.",
    display_order: 2,
  },
];
