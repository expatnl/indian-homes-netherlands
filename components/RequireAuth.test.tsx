import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const useAuthMock = vi.fn();
const pushMock = vi.fn();

vi.mock("@/lib/auth/AuthContext", () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const { RequireAuth } = await import("./RequireAuth");

describe("RequireAuth", () => {
  beforeEach(() => {
    useAuthMock.mockReset();
    pushMock.mockReset();
  });

  it("redirects an unauthenticated user to login", async () => {
    useAuthMock.mockReturnValue({ user: null, loading: false });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/account/login"));
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("allows an authenticated user through", () => {
    useAuthMock.mockReturnValue({ user: { uid: "user-1" }, loading: false });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    expect(screen.getByText("Protected content")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("renders nothing and does not redirect while auth state is still loading", () => {
    useAuthMock.mockReturnValue({ user: null, loading: true });

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    );

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
