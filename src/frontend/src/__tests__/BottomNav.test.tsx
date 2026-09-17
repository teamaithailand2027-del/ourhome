import BottomNav from "@/components/BottomNav";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

describe("BottomNav", () => {
  it("renders the 5-tab bottom navigation with real destinations", () => {
    render(<BottomNav />);
    const nav = screen.getByRole("navigation", { name: "เมนูหลัก" });
    expect(nav).toBeInTheDocument();

    const feed = screen.getByText("ฟีด").closest("a");
    const posts = screen.getByText("โพสต์").closest("a");
    const live = screen.getByText("ไลฟ์สด").closest("a");
    const projects = screen.getByText("โครงการ").closest("a");
    const profile = screen.getByText("โปรไฟล์").closest("a");

    expect(feed).toHaveAttribute("href", "/");
    expect(posts).toHaveAttribute("href", "/posts");
    expect(live).toHaveAttribute("href", "/live");
    expect(projects).toHaveAttribute("href", "/projects");
    expect(profile).toHaveAttribute("href", "/profile");
  });
});
