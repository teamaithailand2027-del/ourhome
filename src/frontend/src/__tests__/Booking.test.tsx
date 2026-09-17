import type { Backend } from "@/backend";
import Booking from "@/pages/Booking";
import { createMockActor, projectFixture } from "@/test/mockActor";
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

// Radix UI Select cannot be reliably driven by userEvent in jsdom (its
// pointer-capture handling hangs). These tests verify the booking flow — that
// choosing a project and submitting calls bookAppointment with the right
// payload — so a native <select> is a faithful, testable stand-in. The
// trigger's `id` is hoisted onto the <select> so the surrounding <Label
// htmlFor> keeps the accessible name.
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

function renderBooking() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <Booking />
    </QueryClientProvider>,
  );
}

describe("Booking", () => {
  beforeEach(() => {
    actorRef.current = createMockActor();
  });

  it("shows the booking form and existing appointments", async () => {
    renderBooking();
    await waitFor(() => {
      expect(screen.getByText("นัดหมายชมโครงการ")).toBeInTheDocument();
    });
    expect(screen.getByText("การนัดหมายของฉัน")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("รอการยืนยัน")).toBeInTheDocument();
    });
  });

  it("books an appointment when the form is filled", async () => {
    const bookAppointment = vi.fn().mockResolvedValue(1n);
    actorRef.current = createMockActor({ bookAppointment });
    renderBooking();
    await waitFor(() => {
      expect(screen.getByText("นัดหมายชมโครงการ")).toBeInTheDocument();
    });

    const projectSelect = screen.getByLabelText("โครงการ") as HTMLSelectElement;
    await waitFor(() => {
      expect(
        Array.from(projectSelect.options).some((o) => o.value === "0"),
      ).toBe(true);
    });
    fireEvent.change(projectSelect, { target: { value: "0" } });

    await userEvent.type(screen.getByLabelText("ชื่อ-นามสกุล"), "สมชาย ใจดี");
    await userEvent.type(screen.getByLabelText("เบอร์โทรศัพท์"), "081-234-5678");
    await userEvent.type(screen.getByLabelText("วันที่"), "2026-10-01");
    await userEvent.type(screen.getByLabelText("เวลา"), "10:00");

    await userEvent.click(
      screen.getByRole("button", { name: "ยืนยันการนัดหมาย" }),
    );

    await waitFor(() => {
      expect(bookAppointment).toHaveBeenCalledWith(
        expect.objectContaining({ projectId: 0n, visitors: 1n }),
      );
    });
    expect(screen.getByText("ส่งคำขอนัดหมายแล้ว")).toBeInTheDocument();
  });

  it("shows the empty state when there are no appointments", async () => {
    actorRef.current = createMockActor({
      listAppointments: vi.fn().mockResolvedValue([]),
    });
    renderBooking();
    await waitFor(() => {
      expect(screen.getByText("ยังไม่มีการนัดหมาย")).toBeInTheDocument();
    });
  });
});
