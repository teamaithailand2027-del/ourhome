import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { vi } from "vitest";

// Generated components use `data-ocid` as their test hook attribute.
configure({ testIdAttribute: "data-ocid" });

// The app's `main.tsx` defines this so TanStack Query can hash query keys that
// contain BigInt (e.g. price filters). Tests render pages directly without
// `main.tsx`, so define it here too.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// `@caffeineai/object-storage` ships an extensionless `./blob` import that
// Node ESM cannot resolve under Vitest. The app's generated `backend.ts`
// re-exports `ExternalBlob` from it, so provide a minimal stand-in.
vi.mock("@caffeineai/object-storage", () => ({
  ExternalBlob: class ExternalBlob {},
}));

// Radix UI Select (used by Booking and Projects) relies on pointer-capture
// and scroll APIs that jsdom does not implement. Without these stubs, opening
// a Select throws "hasPointerCapture is not a function" or
// "candidate?.scrollIntoView is not a function", and selecting an item can
// hang because Radix checks pointer capture state during the click sequence.
const capturedPointers = new Set<number>();
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = (pointerId: number) =>
    capturedPointers.has(pointerId);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = (pointerId: number) => {
    capturedPointers.add(pointerId);
  };
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = (pointerId: number) => {
    capturedPointers.delete(pointerId);
  };
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
