type LoginFormProps = {
  error?: string;
};

export function LoginForm({ error }: LoginFormProps) {
  return (
    <form className="auth-card" action="/api/auth/login" method="post">
      <div className="eyebrow">Kynd Saving Dashboard</div>
      <h1 className="auth-title">Secure sign in</h1>
      <p className="auth-subtitle">
        One login for your admin and affiliate workspace, protected by role-based access.
      </p>

      {error ? <div className="auth-error">{error}</div> : null}

      <label className="field">
        <span>Email</span>
        <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
      </label>

      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
      </label>

      <button className="button button-primary button-lg" type="submit">
        Continue
      </button>

      <div className="auth-hint">
        Use an account that already has a role in <code>dashboard_user_roles</code>.
      </div>
    </form>
  );
}
