import { apiClient } from "./client";

export const tasksApi = {
  getTasks: async () => {
    return apiClient.fetch("/tasks");
  },

  createTask: async (text: string, emoji?: string) => {
    return apiClient.fetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ text, emoji }),
    });
  },
};
