"use client";

/** Footer control that clears the stored consent and reopens the cookie banner. */
export function ManageCookiesButton() {
  const reopen = () => {
    document.cookie = "cookie_consent=; path=/; max-age=0; SameSite=Lax";
    window.location.reload();
  };
  return (
    <button type="button" className="foot-legal-lk" onClick={reopen}>
      Manage cookies
    </button>
  );
}
