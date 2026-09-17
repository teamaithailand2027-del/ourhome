import type { Backend } from "@/backend";
import AgentProfile from "@/pages/AgentProfile";
import { agentFixture, createMockActor, reviewFixture } from "@/test/mockActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { actorRef } = vi.hoisted(() => {
  return { actorRef: { current: null as Backend | null } };
});

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
  useInternetIdentity: () => ({
    identity: { getPrincipal: () => "aaaaa-aa" },
    isAuthenticated: true,
    login: vi.fn(),
    clear: vi.fn(),
    loginStatus: "idle",
    isInitializing: false,
    isLoginIdle: true,
    isLoggingIn: false,
    isLoginSuccess: false,
    isLoginError: false,
    loginError: undefined,
  }),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useParams: () => ({ agentId: "0" }),
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

function renderAgentProfile() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AgentProfile />
    </QueryClientProvider>,
  );
}

describe("AgentProfile", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("shows the agent name, rating and gold Verified Badge", async () => {
    renderAgentProfile();
    await waitFor(() => {
      expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
    });
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(
      screen.getByTestId("agent_profile.verified_badge"),
    ).toBeInTheDocument();
  });

  it("shows the rating category breakdown", async () => {
    renderAgentProfile();
    await waitFor(() => {
      expect(screen.getByText("คะแนนความน่าเชื่อถือ")).toBeInTheDocument();
    });
    expect(screen.getByText("ความน่าเชื่อถือ")).toBeInTheDocument();
    expect(screen.getByText("การให้ข้อมูล")).toBeInTheDocument();
    expect(screen.getByText("การบริการ")).toBeInTheDocument();
    expect(screen.getByText("การติดตามลูกค้า")).toBeInTheDocument();
    expect(screen.getByText("ความสุภาพ")).toBeInTheDocument();
    expect(screen.getByText("ความรวดเร็ว")).toBeInTheDocument();
  });

  it("does not show the Verified Badge for an unverified agent", async () => {
    actorRef.current = createMockActor({
      getAgent: vi.fn().mockResolvedValue({ ...agentFixture, verified: false }),
    });
    renderAgentProfile();
    await waitFor(() => {
      expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
    });
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();
  });

  it("lists reviews from the agent", async () => {
    renderAgentProfile();
    await waitFor(() => {
      expect(
        screen.getByText("ให้ข้อมูลละเอียดมาก พาเข้าชมโครงการอย่างมืออาชีพ"),
      ).toBeInTheDocument();
    });
  });

  it("submits a review comment", async () => {
    const addReview = vi.fn().mockResolvedValue(1n);
    actorRef.current = createMockActor({ addReview });
    renderAgentProfile();
    await waitFor(() => {
      expect(screen.getByText("สมชาย ใจดี")).toBeInTheDocument();
    });

    await userEvent.type(
      screen.getByPlaceholderText("แบ่งปันประสบการณ์ของคุณกับตัวแทน"),
      "บริการดีมาก",
    );
    await userEvent.click(screen.getByRole("button", { name: "ส่งรีวิว" }));

    await waitFor(() => {
      expect(addReview).toHaveBeenCalledWith(
        expect.objectContaining({ comment: "บริการดีมาก", agentId: 0n }),
      );
    });
  });
});
