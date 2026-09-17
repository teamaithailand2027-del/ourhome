import type { Backend } from "@/backend";
import Projects from "@/pages/Projects";
import {
  createMockActor,
  projectFixture,
  townhomeProjectFixture,
} from "@/test/mockActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
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

// Radix UI Select cannot be reliably driven by userEvent in jsdom (its
// pointer-capture handling hangs and leaves portals open). These tests verify
// the Projects filter logic — that choosing a price/house-type calls
// listProjects with the right filter — so a native <select> is a faithful,
// testable stand-in. The trigger's `id` is hoisted onto the <select> so the
// surrounding <Label htmlFor> keeps the accessible name.
vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }) => {
    const trigger = React.Children.toArray(children).find(
      (child) => React.isValidElement<{ id?: string }>(child) && child.props.id,
    ) as React.ReactElement<{ id?: string }> | undefined;
    const id = trigger ? trigger.props.id : undefined;
    return (
      <select
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        data-testid="select"
      >
        {children}
      </select>
    );
  },
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ value, children }) => (
    <option value={value}>{children}</option>
  ),
  SelectTrigger: ({ children }) => <>{children}</>,
  SelectValue: () => null,
}));

function renderProjects() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Projects />
    </QueryClientProvider>,
  );
}

describe("Projects directory", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
    window.history.replaceState(null, "", "/projects");
  });

  it("lists all projects", async () => {
    renderProjects();
    await waitFor(() => {
      expect(screen.getByText("บ้านพฤกษา กาญจนบุรี")).toBeInTheDocument();
    });
    expect(screen.getByText("เดอะทรี ทาวน์โฮม")).toBeInTheDocument();
  });

  it("filters by name via the search input", async () => {
    const listProjects = vi.fn().mockResolvedValue([projectFixture]);
    actorRef.current = createMockActor({ listProjects });
    renderProjects();

    const input = screen.getByPlaceholderText("ค้นหาโครงการตามชื่อ");
    await userEvent.type(input, "พฤกษา");

    await waitFor(() => {
      expect(listProjects).toHaveBeenCalledWith(
        expect.objectContaining({ name: "พฤกษา" }),
      );
    });
  });

  it("applies a price filter and persists it to the URL", async () => {
    const listProjects = vi.fn().mockResolvedValue([projectFixture]);
    actorRef.current = createMockActor({ listProjects });
    renderProjects();

    fireEvent.click(screen.getByRole("button", { name: /ตัวกรอง/ }));
    fireEvent.change(screen.getByLabelText("ช่วงราคา"), {
      target: { value: "2000000-5000000" },
    });

    await waitFor(() => {
      expect(listProjects).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice: 2000000n, maxPrice: 5000000n }),
      );
    });
    expect(window.location.search).toContain("minPrice=2000000");
    expect(window.location.search).toContain("maxPrice=5000000");
  });

  it("applies a house-type filter", async () => {
    const listProjects = vi.fn().mockResolvedValue([townhomeProjectFixture]);
    actorRef.current = createMockActor({ listProjects });
    renderProjects();

    fireEvent.click(screen.getByRole("button", { name: /ตัวกรอง/ }));
    const houseTypeSelect = screen.getByLabelText(
      "แบบบ้าน",
    ) as HTMLSelectElement;
    await waitFor(() => {
      expect(
        Array.from(houseTypeSelect.options).some((o) => o.value === "ทาวน์โฮม"),
      ).toBe(true);
    });
    fireEvent.change(houseTypeSelect, { target: { value: "ทาวน์โฮม" } });

    await waitFor(() => {
      expect(listProjects).toHaveBeenCalledWith(
        expect.objectContaining({ houseType: "ทาวน์โฮม" }),
      );
    });
  });

  it("restores filter state from the URL on load (survives refresh)", async () => {
    window.history.replaceState(
      null,
      "",
      "/projects?name=%E0%B8%9E%E0%B8%A4%E0%B8%81%E0%B8%A9%E0%B8%B2&minPrice=2000000&maxPrice=5000000",
    );
    const listProjects = vi.fn().mockResolvedValue([projectFixture]);
    actorRef.current = createMockActor({ listProjects });
    renderProjects();

    await waitFor(() => {
      expect(listProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "พฤกษา",
          minPrice: 2000000n,
          maxPrice: 5000000n,
        }),
      );
    });
    expect(screen.getByPlaceholderText("ค้นหาโครงการตามชื่อ")).toHaveValue(
      "พฤกษา",
    );
  });

  it("shows the empty state when no projects match", async () => {
    actorRef.current = createMockActor({
      listProjects: vi.fn().mockResolvedValue([]),
    });
    renderProjects();
    await waitFor(() => {
      expect(screen.getByText("ไม่พบโครงการที่ตรงกับเงื่อนไข")).toBeInTheDocument();
    });
  });
});
