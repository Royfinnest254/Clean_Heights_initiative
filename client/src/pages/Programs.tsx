import { useEffect, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Activity = { id: number; title: string; activity_date: string | null; location: string; summary: string; description: string; image_path: string | null; image_alt?: string };
type Program = { id: number; slug: string; title: string; summary: string; description: string; starts_on: string | null; ends_on: string | null; hero_image: string | null; hero_alt?: string; activities: Activity[] };

function dateLabel(value: string | null) {
  if (!value) return "Date to be announced";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [standalone, setStandalone] = useState<Activity[]>([]);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/programs", { cache: "no-cache", signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("CMS unavailable"); return response.json(); })
      .then((data) => { setPrograms(data.programs || []); setStandalone(data.standaloneActivities || []); })
      .catch((error) => { if (error.name !== "AbortError") setOffline(true); })
      .finally(() => setReady(true));
    return () => controller.abort();
  }, []);

  const activityCard = (activity: Activity) => (
    <article key={activity.id} className="overflow-hidden rounded-2xl border border-[#E5DFD3] bg-white shadow-sm">
      {activity.image_path && <img src={activity.image_path} alt={activity.image_alt || ""} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />}
      <div className="p-5"><p className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#68746A]"><span className="inline-flex items-center gap-1"><CalendarDays size={13}/>{dateLabel(activity.activity_date)}</span>{activity.location&&<span className="inline-flex items-center gap-1"><MapPin size={13}/>{activity.location}</span>}</p><h3 className="mt-3 text-lg font-bold text-[#1B4332]">{activity.title}</h3>{activity.summary&&<p className="mt-2 text-sm leading-6 text-[#68746A]">{activity.summary}</p>}{activity.description&&<details className="mt-3 border-t border-[#E5DFD3] pt-3"><summary className="w-fit cursor-pointer rounded-lg px-1 py-2 text-sm font-bold text-[#315D3A] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#477A51]">Read activity details</summary><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#48574D]">{activity.description}</p></details>}</div>
    </article>
  );

  return <div className="min-h-screen bg-[#F7F5F0] text-[#26342C]"><Navigation/><main className="pb-20 pt-32">
    <header className="border-b border-[#E5DFD3] bg-white py-14"><div className="container mx-auto max-w-6xl px-4"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">What we do</p><h1 className="mt-3 text-4xl font-bold text-[#1B4332]">Our programs and activities</h1><p className="mt-4 max-w-2xl text-lg leading-7 text-[#68746A]">Longer-term programs bring related community activities together. Activities can also be shared on their own.</p></div></header>
    <div className="container mx-auto max-w-6xl px-4 py-12">{!ready&&<p className="py-12 text-center text-[#68746A]">Loading current programs…</p>}{ready&&offline&&<div role="status" className="rounded-xl border border-[#E5DFD3] bg-white p-5 text-sm text-[#68746A]">Programs could not be loaded right now. Please try again later.</div>}{ready&&!offline&&programs.length===0&&standalone.length===0&&<div className="rounded-xl border border-[#E5DFD3] bg-white p-7"><h2 className="text-xl font-bold text-[#1B4332]">Programs will appear here</h2><p className="mt-2 text-[#68746A]">New programs and activities will be published by the Clean Heights team.</p></div>}
      <div className="space-y-12">{programs.map((program)=><section key={program.id} id={program.slug} className="overflow-hidden rounded-3xl border border-[#E5DFD3] bg-white shadow-sm">{program.hero_image&&<img src={program.hero_image} alt={program.hero_alt || ""} className="max-h-[420px] w-full object-cover" loading="lazy" decoding="async"/>}<div className="p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A0522D]">Program · {dateLabel(program.starts_on)}{program.ends_on?` – ${dateLabel(program.ends_on)}`:""}</p><h2 className="mt-3 text-3xl font-bold text-[#1B4332]">{program.title}</h2>{program.summary&&<p className="mt-3 max-w-3xl text-lg leading-7 text-[#68746A]">{program.summary}</p>}{program.description&&<p className="mt-4 max-w-4xl whitespace-pre-line leading-7 text-[#48574D]">{program.description}</p>}
        {program.activities.length>0&&<div className="mt-8 border-t border-[#E5DFD3] pt-7"><h3 className="text-xl font-bold text-[#1B4332]">Activities in this program</h3><div className="mt-4 grid gap-4 md:grid-cols-2">{program.activities.map(activityCard)}</div></div>}
      </div></section>)}</div>
      {standalone.length>0&&<section className="mt-14"><h2 className="text-2xl font-bold text-[#1B4332]">Community activities</h2><p className="mt-2 text-[#68746A]">Recent actions, events and smaller projects.</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{standalone.map(activityCard)}</div></section>}
    </div>
  </main><Footer/></div>;
}
