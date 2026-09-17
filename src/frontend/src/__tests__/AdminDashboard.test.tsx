import type { Backend } from "@/backend";
import AdminDashboard from "@/pages/AdminDashboard";
import { createMockActor } from "@/test/mockActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { actorRef } = vi.hoisted(() => {
  return { actorRef: { current: null as Backend | null } };
});

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function renderAdminDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminDashboard />
    </QueryClientProvider>,
  );
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("renders the metric cards from admin metrics", async () => {
    renderAdminDashboard();
    await waitFor(() => {
      expect(screen.getByText("สมาชิก")).toBeInTheDocument();
    });
    // Metric card labels also appear as tab triggers, so assert at least one
    // occurrence of each label.
    for (const label of ["ตัวแทน", "โครงการ", "บ้าน", "โพสต์", "การนัดหมาย"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("renders the management lists with agents data", async () => {
    renderAdminDashboard();
    await waitFor(() => {
      expect(screen.getByText("การจัดการข้อมูล")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
    });
    expect(screen.getByText("OH-0001")).toBeInTheDocument();
    expect(screen.getByText("ยืนยันแล้ว")).toBeInTheDocument();
  });
});
