import { createActor } from "@/backend";
import type {
  Agent,
  Appointment,
  House,
  Post,
  Project,
  ProjectFilter,
  Review,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Agent as SdkAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useReadyActor() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isFetching };
}

/* ------------------------------- Projects ------------------------------- */

export function useProjects(filter: ProjectFilter = {}) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["projects", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProject(id: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSmartSearch(query: string) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["smartSearch", query],
    queryFn: async () => {
      if (!actor) return [];
      return actor.smartSearch(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
  });
}

export function useAddProject() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addProject(project);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateProject(project);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

/* -------------------------------- Houses -------------------------------- */

export function useHouses(projectId: bigint | null = null) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["houses", projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listHouses(projectId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHouse(id: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["house", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHouse(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHouse() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (house: House) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addHouse(house);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
}

export function useUpdateHouse() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (house: House) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateHouse(house);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
}

export function useDeleteHouse() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteHouse(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
  });
}

/* -------------------------------- Agents -------------------------------- */

export function useAgents() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listAgents()) as unknown as Agent[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAgent(id: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      if (!actor) return null;
      return (await actor.getAgent(id)) as unknown as Agent | null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAgent() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agent: Agent) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addAgent(agent as unknown as SdkAgent);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useUpdateAgent() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (agent: Agent) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateAgent(agent as unknown as SdkAgent);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

export function useDeleteAgent() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteAgent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
}

/* -------------------------------- Reviews ------------------------------- */

export function useReviews(agentId: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["reviews", agentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listReviews(agentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReview() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addReview(review);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useReportReview() {
  const { actor } = useReadyActor();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.reportReview(id);
    },
  });
}

/* --------------------------------- Posts --------------------------------- */

export function usePosts() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePost(id: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: Post) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addPost(post);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useLikePost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.likePost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useCommentPost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.commentPost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSharePost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.sharePost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSavePost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.savePost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

/* ------------------------------- Favorites ------------------------------ */

export function useFavorites() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFavoriteProject() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addFavoriteProject(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteProject() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeFavoriteProject(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useAddFavoriteHouse() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addFavoriteHouse(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteHouse() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeFavoriteHouse(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useAddFavoriteHouseType() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (houseType: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addFavoriteHouseType(houseType);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteHouseType() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (houseType: string) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeFavoriteHouseType(houseType);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useAddFavoriteAgent() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addFavoriteAgent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavoriteAgent() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeFavoriteAgent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useAddSavedPost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.addSavedPost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveSavedPost() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.removeSavedPost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

/* ----------------------------- Appointments ----------------------------- */

export function useAppointments() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAppointment(id: bigint) {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAppointment(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.bookAppointment(appointment);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useConfirmAppointment() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.confirmAppointment(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useCancelAppointment() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.cancelAppointment(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

/* ----------------------------- Notifications ---------------------------- */

export function useNotifications() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useReadyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.markNotificationRead(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/* ------------------------------ Admin metrics --------------------------- */

export function useAdminMetrics() {
  const { actor, isFetching } = useReadyActor();
  return useQuery({
    queryKey: ["adminMetrics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdminMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}
