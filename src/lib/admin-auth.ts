import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

const LoginSchema = z.object({ password: z.string().min(1).max(200) });

type AdminSession = { authenticated?: boolean };

function getSession() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters.");
  }
  return useSession<AdminSession>({
    name: "rsc-admin-session",
    password,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  });
}

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(LoginSchema)
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD is not configured on the server.");
    if (data.password !== expected) return { ok: false as const };

    const session = await getSession();
    await session.update({ authenticated: true });
    return { ok: true as const };
  });

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();
  return { authenticated: session.data.authenticated === true };
});

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getSession();
  await session.clear();
  return { ok: true as const };
});
