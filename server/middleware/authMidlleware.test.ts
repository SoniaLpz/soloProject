import { it, vi, expect } from "vitest";
import authMiddleware from "./authMiddleware";

vi.mock("jsonwebtoken");

it("Token accepted", () => {
  const req = {
    headers: { authorization: "json Token" },
  } as any;
  const res = {} as any;
  const next = vi.fn();

  authMiddleware(req, res, next);
  expect(next).toHaveBeenCalled();
});
