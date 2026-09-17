import type { Backend } from "@/backend";
import Home from "@/pages/Home";
import {
  agentFixture,
  createMockActor,
  houseFixture,
  postFixture,
  projectFixture,
} from "@/test/mockActor";
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

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>,
  );
}

describe("Home", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("loads without a blank screen and shows the hero and feed", async () => {
    renderHome();
    expect(
      screen.getByText("ค้นหาบ้านในฝันของคุณ", { exact: false }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText("บ้านพฤกษา กาญจนบุรี").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("โพสต์ล่าสุด")).toBeInTheDocument();
  });

  it("shows the empty state when there are no projects", async () => {
    actorRef.current = createMockActor({
      listProjects: vi.fn().mockResolvedValue([]),
    });
    renderHome();
    await waitFor(() => {
      expect(screen.getByText("ยังไม่มีโครงการ")).toBeInTheDocument();
    });
  });

  it("runs a smart search and shows matching results", async () => {
    const smartSearch = vi.fn().mockResolvedValue([projectFixture]);
    actorRef.current = createMockActor({ smartSearch });
    renderHome();

    const input = screen.getByPlaceholderText(
      "ค้นหาโครงการหรือทำเลที่ต้องการ เช่น บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน",
    );
    await userEvent.type(input, "บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน");
    await userEvent.click(screen.getByRole("button", { name: "ค้นหา" }));

    await waitFor(() => {
      expect(smartSearch).toHaveBeenCalledWith("บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน");
    });
    await waitFor(() => {
      expect(screen.getAllByText("บ้านพฤกษา กาญจนบุรี").length).toBeGreaterThan(0);
    });
  });

  it("shows the empty search state when no results match", async () => {
    actorRef.current = createMockActor({
      smartSearch: vi.fn().mockResolvedValue([]),
    });
    renderHome();

    const input = screen.getByPlaceholderText(
      "ค้นหาโครงการหรือทำเลที่ต้องการ เช่น บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน",
    );
    await userEvent.type(input, "ไม่มีโครงการนี้");
    await userEvent.click(screen.getByRole("button", { name: "ค้นหา" }));

    await waitFor(() => {
      expect(screen.getByText("ไม่พบโครงการที่ตรงกับคำค้นหา")).toBeInTheDocument();
    });
  });

  it("renders the feed post with agent name and like count", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getAllByText("สมชาย ใจดี").length).toBeGreaterThan(0);
    });
    expect(screen.getByText("128")).toBeInTheDocument();
  });

  it("renders featured houses and house types", async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText("บ้านแนะนำ")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getAllByText("บ้านเดี่ยว").length).toBeGreaterThan(0);
    });
  });

  it("saves a post from the feed to the user's favorites", async () => {
    const addSavedPost = vi.fn().mockResolvedValue(undefined);
    actorRef.current = createMockActor({ addSavedPost });
    renderHome();
    await waitFor(() => {
      expect(screen.getAllByText("สมชาย ใจดี").length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole("button", { name: "บันทึก" }));
    await waitFor(() => {
      expect(addSavedPost).toHaveBeenCalledWith(0n);
    });
  });
});
