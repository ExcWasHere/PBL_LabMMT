// src/types.ts

export type StatusType = "Published" | "Waiting" | "Review" | "Muted" | "Draft";

export interface Project {
  id: number;
  title: string;
  category: string; 
  date: string;
  publisher: string;
  stars: string | number;
  status: StatusType;
  description?: string;
  tech?: string;
  teamMembers?: any[]; 
  thumbnailUrl?: string;
  photoUrls?: string[];
  githubLink?: string;
  demoLink?: string;
}

export interface News {
  id: number;
  title: string;
  category: string;
  date: string;
  publisher: string;
  status: StatusType;
  location?: string;
  content?: string;
  coverUrl?: string;
  docGuide?: string;
  newsLink?: string;
}

export interface Gallery {
  id: number;
  title: string;
  photo: string | number;
  video: string | number;
  animation: string | number;
  date: string;
  publisher: string;
  status: StatusType;
  description?: string;
  location?: string;
  mediaFiles?: string[];
}

export interface Member {
  name: string;
  identityNum: string;
  role: string;
  startDate: string;
  position: string;
}