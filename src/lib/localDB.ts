import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'projects.json');

export interface Project {
  id: number;
  tag: string;
  title: string;
  category: string;
  description: string;
  symbol_url: string;
  image_url: string | null;
  display_order: number;
}

function ensureDBFile() {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    const { mkdirSync } = require('fs');
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

export function getAllProjects(): Project[] {
  try {
    ensureDBFile();
    const data = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getProjectById(id: number): Project | undefined {
  const projects = getAllProjects();
  return projects.find(p => p.id === id);
}

export function createProject(data: Omit<Project, 'id'>): Project {
  ensureDBFile();
  const projects = getAllProjects();
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  const newProject = { id: newId, ...data };
  projects.push(newProject);
  writeFileSync(DB_PATH, JSON.stringify(projects, null, 2));
  return newProject;
}

export function updateProject(id: number, data: Partial<Omit<Project, 'id'>>): Project | null {
  ensureDBFile();
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  projects[index] = { ...projects[index], ...data };
  writeFileSync(DB_PATH, JSON.stringify(projects, null, 2));
  return projects[index];
}

export function deleteProject(id: number): boolean {
  ensureDBFile();
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  
  writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
  return true;
}
