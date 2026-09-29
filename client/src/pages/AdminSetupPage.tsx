import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { ShieldCheck } from "lucide-react";

const fieldClass = "w-full rounded-lg border border-[#D8D2C7] bg-white px-3 py-2.5 text-sm text-[#26342C] outline-none focus:border-[#477A51] focus:ring-2 focus:ring-[#477A51]/20";

export default function AdminSetupPage() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [form, setForm] = useState({ setupKey: "", email: "", displayName: "", password: "", confirmPassword: "" });
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/setup-status", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not check setup status.");
        setAvailable(Boolean(data.available));
      })
      .catch(() => setAvailable(false));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setNotice("");
    if (form.password !== form.confirmPassword) return setNotice("The passwords do not match.");
    if (form.password.length < 14) return setNotice("Choose a password with at least 14 characters.");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ setupKey: form.setupKey, email: form.email, displayName: form.displayName, password: form.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Setup failed (${response.status}).`);
      setDone(true);
      setAvailable(false);
      setNotice(data.message || "Administrator created. Remove the setup key from cPanel, restart the app, then sign in.");
      setForm({ setupKey: "", email: "", displayName: "", password: "", confirmPassword: "" });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create the administrator.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-[#E5DFD3] bg-white p-6 shadow-xl sm:p-8">
        <Link href="/admin" className="text-sm font-semibold text-[#477A51] hover:underline">← Content portal sign-in</Link>
        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1E8] text-[#315D3A]"><ShieldCheck /></div>
        <h1 className="mt-5 text-2xl font-bold text-[#1B4332]">First administrator setup</h1>
        {available === null ? <p className="mt-3 text-sm text-[#68746A]">Checking whether first-time setup is available…</p> : !available ? (
          <div className="mt-4 rounded-lg bg-[#F7F5F0] p-4 text-sm leading-6 text-[#48574D]">
            <p>{done ? notice : "First-time setup is closed. Either an administrator already exists, or the hosting setup key is missing."}</p>
            <Link href="/admin" className="mt-4 inline-block font-bold text-[#315D3A] underline">Go to sign in</Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-[#68746A]">This page works only before the first administrator is created. Enter the temporary setup key you added in the Node.js app settings in cPanel.</p>
            {notice && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{notice}</p>}
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">Temporary setup key<input required type="password" autoComplete="off" className={`${fieldClass} mt-1`} value={form.setupKey} onChange={(e) => setForm({ ...form, setupKey: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Administrator name<input required minLength={2} maxLength={160} autoComplete="name" className={`${fieldClass} mt-1`} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Administrator email<input required type="email" autoComplete="email" className={`${fieldClass} mt-1`} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label className="block text-sm font-semibold">New password (14 characters minimum)<input required minLength={14} maxLength={1024} type="password" autoComplete="new-password" className={`${fieldClass} mt-1`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
              <label className="block text-sm font-semibold">Type the password again<input required minLength={14} maxLength={1024} type="password" autoComplete="new-password" className={`${fieldClass} mt-1`} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} /></label>
              <button disabled={busy} className="w-full rounded-lg bg-[#1B4332] px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Creating administrator…" : "Create first administrator"}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
