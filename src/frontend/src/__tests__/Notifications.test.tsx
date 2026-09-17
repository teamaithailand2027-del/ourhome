import type { Backend } from "@/backend";
import Notifications from "@/pages/Notifications";
import { createMockActor, notificationFixture } from "@/test/mockActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { actorRef } = vi.hoisted(() => {
  return { actorRef: { current: null as Backend | null } };
});

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function renderNotifications() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Notifications />
    </QueryClientProvider>,
  );
}

describe("Notifications", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("shows unread notifications with a new badge", async () => {
    renderNotifications();
    await waitFor(() => {
      expect(screen.getByText("มีการนัดหมายใหม่")).toBeInTheDocument();
    });
    expect(screen.getByText("ใหม่")).toBeInTheDocument();
  });

  it("marks a notification read on click", async () => {
    const markNotificationRead = vi.fn().mockResolvedValue(undefined);
    actorRef.current = createMockActor({ markNotificationRead });
    renderNotifications();
    await waitFor(() => {
      expect(screen.getByText("มีการนัดหมายใหม่")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("มีการนัดหมายใหม่"));
    await waitFor(() => {
      expect(markNotificationRead).toHaveBeenCalledWith(0n);
    });
  });

  it("marks all notifications read", async () => {
    const markNotificationRead = vi.fn().mockResolvedValue(undefined);
    actorRef.current = createMockActor({ markNotificationRead });
    renderNotifications();
    await waitFor(() => {
      expect(screen.getByText("มีการนัดหมายใหม่")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /อ่านทั้งหมด/ }));
    await waitFor(() => {
      expect(markNotificationRead).toHaveBeenCalledWith(0n);
    });
  });

  it("shows the empty state when there are no notifications", async () => {
    actorRef.current = createMockActor({
      listNotifications: vi.fn().mockResolvedValue([]),
    });
    renderNotifications();
    await waitFor(() => {
      expect(screen.getByText("ไม่มีการแจ้งเตือน")).toBeInTheDocument();
    });
  });
});
