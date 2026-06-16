import { BrandMark, Wordmark } from "@/components/BrandMark";
import { login } from "../auth-actions";

export const metadata = { title: "Sign in — The Outlayer Admin" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const { error, from } = await searchParams;

  return (
    <div className="admin">
      <div className="login-wrap">
        <div className="login-card">
          <div className="brand">
            <BrandMark size={26} />
            <Wordmark />
          </div>
          <h1>Admin sign in</h1>
          <p>Enter the admin password to manage content.</p>

          {error === "unconfigured" ? (
            <div className="flash err">
              No ADMIN_PASSWORD is set. Add it to <code>.env.local</code> and restart the server.
            </div>
          ) : error ? (
            <div className="flash err">Incorrect password — try again.</div>
          ) : null}

          <form action={login}>
            <input type="hidden" name="from" value={from ?? "/admin"} />
            <div className="fld">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoFocus required />
            </div>
            <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
