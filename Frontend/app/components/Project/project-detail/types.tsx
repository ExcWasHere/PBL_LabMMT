export interface Reply {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  rating: number;
  likes: number;
  replies: Reply[];
}

export interface ProjectDetailItem {
  label: string;
  value: string | number;
}

export interface TeamMember {
  name: string;
  role: string;
  img: string;
}