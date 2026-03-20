import { useStore } from "@/lib/store/store";

/**
 * Current user id for collaboration (comment author, task creator, etc.).
 * Reads from the unified Zustand auth slice.
 */
export function getCurrentUserId(): string {
  const user = useStore.getState().user;
  return user?.id ?? "";
}

export function getCurrentUserDisplayName(): string {
  const user = useStore.getState().user;
  return user?.full_name ?? user?.email ?? "You";
}
