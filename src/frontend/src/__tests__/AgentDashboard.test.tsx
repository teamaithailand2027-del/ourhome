import type { Backend } from "@/backend";
import AgentDashboard from "@/pages/AgentDashboard";
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

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      to,
      children,
      ...rest
    }: {
      to: string;
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <a href={to} {...rest}>
        {children}
      </a>
    ),
  };
});

function renderAgentDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AgentDashboard />
    </QueryClientProvider>,
  );
}

describe("AgentDashboard", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("renders the agent profile strip and metric cards", async () => {
    renderAgentDashboard();
    await waitFor(() => {
      expect(screen.getAllByText("สมชาย ใจดี").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("ลีดใหม่")).toBeInTheDocument();
    expect(screen.getByText("การนำเสนอ")).toBeInTheDocument();
    expect(screen.getAllByText("งานติดตาม").length).toBeGreaterThan(0);
    expect(screen.getAllByText("โครงการที่ดูแล").length).toBeGreaterThan(0);
  });

  it("renders the appointments and managed projects lists", async () => {
    renderAgentDashboard();
    await waitFor(() => {
      expect(screen.getByText("การนัดหมาย")).toBeInTheDocument();
    });
    expect(screen.getAllByText("โครงการที่ดูแล").length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(screen.getByText("บ้านพฤกษา กาญจนบุรี")).toBeInTheDocument();
    });
  });

  it("renders the latest reviews", async () => {
    renderAgentDashboard();
    await waitFor(() => {
      expect(
        screen.getByText("ให้ข้อมูลละเอียดมาก พาเข้าชมโครงการอย่างมืออาชีพ"),
      ).toBeInTheDocument();
    });
  });
});
