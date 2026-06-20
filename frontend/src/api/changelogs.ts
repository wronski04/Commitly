import { api } from "./client";
import type { Changelog, Tone } from "../types";

export const listChangelogs = async (
  projectId: string,
): Promise<Changelog[]> => {
  const { data } = await api.get<Changelog[]>(
    `/projects/${projectId}/changelogs`,
  );
  return data;
};

export const generateChangelog = async (
  projectId: string,
  rawInput: string,
  tone: Tone,
  versionTag: string | null,
): Promise<Changelog> => {
  const { data } = await api.post<Changelog>(
    `/projects/${projectId}/changelogs/generate`,
    { raw_input: rawInput, tone, version_tag: versionTag },
  );
  return data;
};

export const getChangelog = async (id: string): Promise<Changelog> => {
  const { data } = await api.get<Changelog>(`/changelogs/${id}`);
  return data;
};

export const updateChangelog = async (
  id: string,
  title: string,
  content: string,
): Promise<Changelog> => {
  const { data } = await api.patch<Changelog>(`/changelogs/${id}`, {
    title,
    content,
  });
  return data;
};

export const deleteChangelog = async (id: string): Promise<void> => {
  await api.delete(`/changelogs/${id}`);
};

export const exportChangelog = async (id: string): Promise<string> => {
  const { data } = await api.get<string>(`/changelogs/${id}/export`, {
    responseType: "text",
  });
  return data;
};
