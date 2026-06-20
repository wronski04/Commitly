export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export type Tone = "technical" | "user_friendly";

export interface Changelog {
  id: string;
  project_id: string;
  title: string;
  raw_input: string;
  content: string;
  tone: string;
  version_tag: string | null;
  created_at: string;
  updated_at: string;
}
