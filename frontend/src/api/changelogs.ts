import { api } from "./client";
import type { Changelog } from "../types";

export const listChangelogs = async (
  projectId: string,
): Promise<Changelog[]> => {
  const { data } = await api.get<Changelog[]>(
    `/projects/${projectId}/changelogs`,
  );
  return data;
};
