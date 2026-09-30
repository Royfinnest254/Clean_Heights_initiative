import { useEffect, useState } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "chi-cookie-notice-v1";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "dismissed");
    } catch {
      setVisible(true);
    }
    const openSettings = () => {
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener("chi:cookie-settings", openSettings);
    return () => window.removeEventListener("chi:cookie-settings", openSettings);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // The notice can still be dismissed for this page view if storage is disabled.
    }
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) return null;

  return (
    <aside aria-label="Cookie and browser storage notice" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#E5DFD3] bg-white p-5 text-[var(--chi-charcoal)] shadow-2xl sm:inset-x-6 sm:bottom-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <h2 className="text-base font-bold text-[var(--chi-forest)]">Essential browser storage</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--chi-grey)]">This site uses browser storage to remember that you closed this notice and to save display preferences. It does not currently run analytics or advertising trackers.</p>
          {settingsOpen && <p className="mt-2 text-sm leading-6 text-[var(--chi-grey)]">Optional analytics and advertising storage are not active. External fonts and images may still be requested from their providers. Read the <Link href="/cookies" className="font-semibold text-[var(--chi-leaf)] underline">Cookie Notice</Link> for details.</p>}
          <Link href="/privacy" className="mt-2 inline-block text-sm font-semibold text-[var(--chi-leaf)] underline">Privacy Notice</Link>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="rounded-lg border border-[#D8D2C7] px-3 py-2 text-sm font-semibold hover:bg-[#F7F5F0]">{settingsOpen ? "Hide details" : "Cookie settings"}</button>
          <button type="button" onClick={dismiss} className="rounded-lg bg-[var(--chi-forest)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Close notice</button>
        </div>
      </div>
    </aside>
  );
}
