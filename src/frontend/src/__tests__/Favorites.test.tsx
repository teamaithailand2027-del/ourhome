import type { Backend } from "@/backend";
import Favorites from "@/pages/Favorites";
import {
  createMockActor,
  favoriteFixture,
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

function renderFavorites() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Favorites />
    </QueryClientProvider>,
  );
}

describe("Favorites", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("shows favorited projects", async () => {
    renderFavorites();
    await waitFor(() => {
      expect(screen.getByText("บ้านพฤกษา กาญจนบุรี")).toBeInTheDocument();
    });
    expect(screen.getByText("โครงการ (1)")).toBeInTheDocument();
  });

  it("removes a favorited project", async () => {
    const removeFavoriteProject = vi.fn().mockResolvedValue(undefined);
    actorRef.current = createMockActor({ removeFavoriteProject });
    renderFavorites();
    await waitFor(() => {
      expect(screen.getByText("บ้านพฤกษา กาญจนบุรี")).toBeInTheDocument();
    });

    await userEvent.click(
      screen.getByRole("button", { name: "ลบโครงการออกจากรายการโปรด" }),
    );
    await waitFor(() => {
      expect(removeFavoriteProject).toHaveBeenCalledWith(0n);
    });
  });

  it("shows the empty state when there are no favorites", async () => {
    actorRef.current = createMockActor({
      getFavorites: vi.fn().mockResolvedValue({
        ...favoriteFixture,
        projects: [],
      }),
    });
    renderFavorites();
    await waitFor(() => {
      expect(screen.getByText("ยังไม่มีโครงการที่บันทึก")).toBeInTheDocument();
    });
  });
});
