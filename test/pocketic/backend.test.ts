import { PocketIc, createIdentity } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { ProjectFilter, _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

// The Candid ProjectFilter record requires every optional key to be present
// (as [] or [value]); the frontend wrapper fills absent fields with [] but the
// raw idlFactory actor does not, so tests must supply the full shape.
const emptyFilter: ProjectFilter = {
  province: [],
  newProject: [],
  bedrooms: [],
  name: [],
  maxPrice: [],
  district: [],
  promotion: [],
  usableArea: [],
  minPrice: [],
  houseType: [],
  readyToMove: [],
  location: [],
};

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  await expect(actor.listNotifications()).resolves.toEqual([]);
  await expect(actor.listAppointments()).resolves.toEqual([]);
});

it("lists seeded projects and agents from the migration", async () => {
  const projects = await actor.listProjects(emptyFilter);
  expect(projects.length).toBeGreaterThan(0);
  expect(projects[0].name).toBe("บ้านพฤกษา กาญจนบุรี");

  const agents = await actor.listAgents();
  expect(agents.length).toBeGreaterThan(0);
  expect(agents[0].verified).toBe(true);
});

it("filters projects by name, price and house type", async () => {
  const byName = await actor.listProjects({ ...emptyFilter, name: ["พฤกษา"] });
  expect(byName.length).toBeGreaterThan(0);
  expect(byName[0].name).toContain("พฤกษา");

  const byPrice = await actor.listProjects({
    ...emptyFilter,
    minPrice: [2_000_000n],
    maxPrice: [3_000_000n],
  });
  expect(byPrice.length).toBeGreaterThan(0);
  for (const p of byPrice) {
    expect(p.startingPrice).toBeGreaterThanOrEqual(2_000_000n);
    expect(p.startingPrice).toBeLessThanOrEqual(3_000_000n);
  }

  const byType = await actor.listProjects({ ...emptyFilter, houseType: ["ทาวน์โฮม"] });
  expect(byType.length).toBeGreaterThan(0);
  for (const p of byType) {
    expect(p.houseTypes).toContain("ทาวน์โฮม");
  }
});

it("parses a natural-language smart search query", async () => {
  const results = await actor.smartSearch("บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน");
  expect(results.length).toBeGreaterThan(0);
  for (const p of results) {
    expect(p.location.province).toBe("กาญจนบุรี");
    expect(p.houseTypes).toContain("บ้านเดี่ยว");
    expect(p.startingPrice).toBeLessThanOrEqual(3_000_000n);
  }
});

it("round-trips a favorite project through the real canister", async () => {
  const favorites = await actor.getFavorites();
  const before = favorites.projects.length;
  await actor.addFavoriteProject(0n);
  const after = await actor.getFavorites();
  expect(after.projects).toContain(0n);
  expect(after.projects.length).toBe(before + 1);
  await actor.removeFavoriteProject(0n);
  const removed = await actor.getFavorites();
  expect(removed.projects).not.toContain(0n);
});

it("round-trips a booking appointment through the real canister", async () => {
  // listAppointments returns only the caller's own appointments, so book and
  // read back as the same principal.
  const identity = createIdentity("booking-agent-seed");
  actor.setIdentity(identity);
  const caller = identity.getPrincipal();
  const before = (await actor.listAppointments()).length;
  const id = await actor.bookAppointment({
    id: 0n,
    userId: caller,
    projectId: 0n,
    houseType: [],
    date: 1_750_000_000_000_000_000n,
    time: 1_750_000_000_000_000_000n,
    visitors: 2n,
    agentId: [0n],
    houseId: [],
    name: "สมชาย ใจดี",
    phone: "081-234-5678",
    status: { pending: null },
  });
  const after = await actor.listAppointments();
  expect(after.length).toBe(before + 1);
  expect(after.some((a) => a.id === id)).toBe(true);
});

it("round-trips a notification read through the real canister", async () => {
  const id = await actor.bookAppointment({
    id: 0n,
    userId: (await actor.getAgent(0n))![0].userId,
    projectId: 0n,
    houseType: [],
    date: 1_750_000_000_000_000_000n,
    time: 1_750_000_000_000_000_000n,
    visitors: 1n,
    agentId: [],
    houseId: [],
    name: "สมชาย ใจดี",
    phone: "081-234-5678",
    status: { pending: null },
  });
  const notifications = await actor.listNotifications();
  expect(notifications.length).toBeGreaterThan(0);
  const unread = notifications.find((n) => !n.read);
  if (unread) {
    await actor.markNotificationRead(unread.id);
    const after = await actor.listNotifications();
    expect(after.find((n) => n.id === unread.id)?.read).toBe(true);
  }
});

it("returns admin metrics without trapping", async () => {
  const metrics = await actor.getAdminMetrics();
  expect(metrics.projects).toBeGreaterThan(0n);
  expect(metrics.agents).toBeGreaterThan(0n);
});

it("lists reviews for a seeded agent", async () => {
  const reviews = await actor.listReviews(0n);
  expect(reviews.length).toBeGreaterThan(0);
  expect(reviews[0].agentId).toBe(0n);
});

it("round-trips a review through the real canister", async () => {
  const before = (await actor.listReviews(0n)).length;
  // addReview is idempotent per reviewer per agent; the seeded reviews for
  // agent 0 already use "aaaaa-aa", so use a distinct reviewer to create one.
  const id = await actor.addReview({
    id: 0n,
    agentId: 0n,
    reviewerId: createIdentity("reviewer-seed").getPrincipal(),
    rating: 5n,
    categories: { trust: 5n, info: 5n, service: 5n, followUp: 5n, politeness: 5n, speed: 5n },
    comment: "ทดสอบรีวิว",
    createdAt: 1_750_000_000_000_000_000n,
    reported: false,
  });
  const after = await actor.listReviews(0n);
  expect(after.length).toBe(before + 1);
  expect(after.some((r) => r.id === id)).toBe(true);
});
