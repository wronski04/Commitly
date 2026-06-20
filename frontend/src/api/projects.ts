import { api } from "./client";
import type { Project } from "../types";

export const listProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>("/projects");
  return data;
};

export const createProject = async (
  name: string,
  description: string | null,
): Promise<Project> => {
  const { data } = await api.post<Project>("/projects", { name, description });
  return data;
};

export const getProject = async (id: string): Promise<Project> => {
  const { data } = await api.get<Project>(`/projects/${id}`);
  return data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
