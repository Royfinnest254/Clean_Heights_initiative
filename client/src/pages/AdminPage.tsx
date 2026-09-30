import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { LogOut, ImagePlus, FolderKanban, CalendarDays, ShieldCheck } from "lucide-react";

type Program = { id: number; slug: string; title: string; summary: string; description: string; status: "draft" | "published"; starts_on: string | null; ends_on: string | null; hero_image: string | null };
type Activity = { id: number; program_id: number | null; title: string; activity_date: string | null; location: string; summary: string; description: string; status: "draft" | "published"; image_path: string | null };
type Media = { id: number; original_name: string; path: string; alt_text: string; width: number; height: number; bytes: number };
type Slot = { slot_key: string; media_id: number | null; alt_text: string };

const fieldClass = "w-full rounded-lg border border-[#D8D2C7] bg-white px-3 py-2.5 text-sm text-[#26342C] outline-none focus:border-[#477A51] focus:ring-2 focus:ring-[#477A51]/20";
const knownImageSlots = ["brand.logo", "home.hero", "home.community", "home.partner.shoe4africa", "home.partner.nema", "home.partner.elgeyo-marakwet", "home.partner.swiss-side", "about.founder", "team.cynthia-founder.photo"];
const emptyProgram = { title: "", slug: "", summary: "", description: "", status: "draft", startsOn: "", endsOn: "", heroImage: "" };
const emptyActivity = { title: "", programId: "", activityDate: "", location: "", summary: "", description: "", status: "draft", imagePath: "" };

async function responseJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

export default function AdminPage() {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [csrf, setCsrf] = useState("");
  const [pageReady, setPageReady] = useState(false);
  const [tab, setTab] = useState<"programs" | "activities" | "media">("programs");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [programId, setProgramId] = useState<number | null>(null);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [programForm, setProgramForm] = useState(emptyProgram);
  const [activityForm, setActivityForm] = useState(emptyActivity);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [slotKey, setSlotKey] = useState("");
  const [slotMedia, setSlotMedia] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const api = async (url: string, init: RequestInit = {}) => responseJson(await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: { ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(csrf ? { "X-CSRF-Token": csrf } : {}), ...init.headers },
  }));

  const loadContent = async () => {
    const [content, mediaData, slotData] = await Promise.all([
      api("/api/admin/programs"), api("/api/admin/media"), api("/api/admin/image-slots"),
    ]);
    setPrograms(content.programs);
    setActivities(content.activities);
    setMedia(mediaData.media);
    setSlots(slotData.slots);
  };

  useEffect(() => {
    api("/api/admin/me").then((result) => { setUser(result.user); setCsrf(result.csrfToken); }).catch(() => {}).finally(() => setPageReady(true));
  }, []);

  useEffect(() => {
    if (user) loadContent().catch((error) => setNotice(error.message));
  }, [user]);

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const result = await api("/api/admin/login", { method: "POST", body: JSON.stringify(login) });
      setUser(result.user); setCsrf(result.csrfToken); setLogin({ email: "", password: "" });
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not sign in."); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    try { await api("/api/admin/logout", { method: "POST", body: "{}" }); } finally { setUser(null); setCsrf(""); }
  };

  const chooseProgram = (program: Program) => {
    setProgramId(program.id);
    setProgramForm({ title: program.title, slug: program.slug, summary: program.summary, description: program.description, status: program.status, startsOn: program.starts_on || "", endsOn: program.ends_on || "", heroImage: program.hero_image || "" });
  };
  const chooseActivity = (activity: Activity) => {
    setActivityId(activity.id);
    setActivityForm({ title: activity.title, programId: activity.program_id ? String(activity.program_id) : "", activityDate: activity.activity_date || "", location: activity.location, summary: activity.summary, description: activity.description, status: activity.status, imagePath: activity.image_path || "" });
  };

  const addActivityToProgram = (program: Program) => {
    setActivityId(null);
    setActivityForm({ ...emptyActivity, programId: String(program.id) });
    setTab("activities");
    setNotice(`New activity will be added to “${program.title}”.`);
  };

  const saveProgram = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const payload = { ...programForm, startsOn: programForm.startsOn || null, endsOn: programForm.endsOn || null };
      await api(programId ? `/api/admin/programs/${programId}` : "/api/admin/programs", { method: programId ? "PUT" : "POST", body: JSON.stringify(payload) });
      setNotice("Program saved."); setProgramId(null); setProgramForm(emptyProgram); await loadContent();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save program."); }
    finally { setBusy(false); }
  };

  const saveActivity = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const payload = { ...activityForm, programId: activityForm.programId ? Number(activityForm.programId) : null, activityDate: activityForm.activityDate || null };
      await api(activityId ? `/api/admin/activities/${activityId}` : "/api/admin/activities", { method: activityId ? "PUT" : "POST", body: JSON.stringify(payload) });
      setNotice("Activity saved."); setActivityId(null); setActivityForm(emptyActivity); await loadContent();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save activity."); }
    finally { setBusy(false); }
  };

  const deleteItem = async (kind: "programs" | "activities", id: number) => {
    if (!window.confirm(`Delete this ${kind === "programs" ? "program" : "activity"}?`)) return;
    try { await api(`/api/admin/${kind}/${id}`, { method: "DELETE" }); await loadContent(); setNotice("Deleted."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Could not delete item."); }
  };

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    if (!uploadFile) return setNotice("Choose an image first.");
    setBusy(true); setNotice("");
    try {
      const form = new FormData(); form.append("image", uploadFile); form.append("altText", uploadAlt);
      await api("/api/admin/media", { method: "POST", body: form });
      setUploadFile(null); setUploadAlt(""); await loadContent(); setNotice("Image uploaded and optimized as WebP.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Image upload failed."); }
    finally { setBusy(false); }
  };

  const saveSlot = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api(`/api/admin/image-slots/${encodeURIComponent(slotKey)}`, { method: "PUT", body: JSON.stringify({ mediaId: slotMedia ? Number(slotMedia) : null, altText: media.find((item) => item.id === Number(slotMedia))?.alt_text || "" }) });
      setSlotKey(""); setSlotMedia(""); await loadContent(); setNotice("Image slot saved. The public template must use this slot key for the override to appear.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save image slot."); }
  };

  if (!pageReady) return <div className="min-h-screen bg-[#F7F5F0] p-8">Loading secure portal…</div>;
  if (!user) return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-12">
      <form onSubmit={submitLogin} className="w-full max-w-md rounded-2xl border border-[#E5DFD3] bg-white p-8 shadow-xl">
        <Link href="/" className="text-sm font-semibold text-[#477A51] hover:underline">← Public website</Link>
        <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1E8] text-[#315D3A]"><ShieldCheck /></div>
        <h1 className="mt-5 text-2xl font-bold text-[#1B4332]">Content portal</h1>
        <p className="mt-2 text-sm leading-6 text-[#68746A]">Sign in with your administrator email and password.</p>
        {notice && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{notice}</p>}
        <label className="mt-6 block text-sm font-semibold">Email<input className={`${fieldClass} mt-2`} type="email" autoComplete="username" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input className={`${fieldClass} mt-2`} type="password" autoComplete="current-password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} /></label>
        <button disabled={busy} className="mt-6 w-full rounded-lg bg-[#1B4332] px-4 py-3 font-bold text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
        <p className="mt-4 text-xs leading-5 text-[#68746A]">First time here? <Link href="/admin/setup" className="font-semibold text-[#315D3A] underline">Set up the first administrator</Link>. Setup closes automatically after the first account is created.</p>
      </form>
    </main>
  );

  const tabButton = (value: typeof tab, label: string, Icon: typeof FolderKanban) => <button type="button" onClick={() => setTab(value)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${tab === value ? "bg-[#1B4332] text-white" : "text-[#48574D] hover:bg-[#EAF1E8]"}`}><Icon size={16} />{label}</button>;
  return (
    <main className="min-h-screen bg-[#F7F5F0] text-[#26342C]">
      <header className="border-b border-[#E5DFD3] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#477A51]">Clean Heights Initiative</p><h1 className="mt-1 text-xl font-bold text-[#1B4332]">Content portal</h1></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm text-[#68746A] sm:block">{user.displayName}</span><button onClick={logout} className="flex items-center gap-2 rounded-lg border border-[#D8D2C7] px-3 py-2 text-sm font-semibold"><LogOut size={15} />Sign out</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-wrap content-start gap-2 lg:flex-col">{tabButton("programs","Programs",FolderKanban)}{tabButton("activities","Activities",CalendarDays)}{tabButton("media","Images & slots",ImagePlus)}<p className="mt-3 text-xs leading-5 text-[#68746A]">Published items appear publicly. Drafts stay in the portal.</p></aside>
        <section className="min-w-0 rounded-2xl border border-[#E5DFD3] bg-white p-4 shadow-sm sm:p-6">
          {notice && <p role="status" className="mb-5 rounded-lg bg-[#EAF1E8] p-3 text-sm text-[#315D3A]">{notice}</p>}
          {tab === "programs" && <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
            <div><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Programs</h2><p className="mt-1 text-sm text-[#68746A]">Each program can contain multiple activities.</p></div><button onClick={() => { setProgramId(null); setProgramForm(emptyProgram); }} className="rounded-lg bg-[#1B4332] px-3 py-2 text-sm font-semibold text-white">New program</button></div>
              <div className="mt-5 space-y-3">{programs.map((item) => <div key={item.id} className="rounded-xl border border-[#E5DFD3] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-xs uppercase tracking-wide text-[#68746A]">{item.status} · {activities.filter((a) => a.program_id === item.id).length} activities</p></div><div className="flex flex-wrap gap-3"><button onClick={() => addActivityToProgram(item)} className="text-sm font-semibold text-[#315D3A] underline">+ Add activity</button><button onClick={() => chooseProgram(item)} className="text-sm font-semibold text-[#315D3A] underline">Edit program</button><button onClick={() => deleteItem("programs",item.id)} className="text-sm font-semibold text-red-700 underline">Delete</button></div></div><p className="mt-3 text-sm leading-6 text-[#68746A]">{item.summary}</p></div>)}</div>
            </div>
            <form onSubmit={saveProgram} className="rounded-xl bg-[#F7F5F0] p-4 sm:p-5"><h3 className="font-bold">{programId ? "Edit program" : "New program"}</h3><div className="mt-4 space-y-3">
              <label className="block text-sm font-semibold">Title<input required maxLength={180} className={`${fieldClass} mt-1`} value={programForm.title} onChange={(e)=>setProgramForm({...programForm,title:e.target.value})}/></label>
              <label className="block text-sm font-semibold">URL slug<input className={`${fieldClass} mt-1`} value={programForm.slug} onChange={(e)=>setProgramForm({...programForm,slug:e.target.value})} placeholder="generated-from-title"/></label>
              <label className="block text-sm font-semibold">Short summary<input className={`${fieldClass} mt-1`} maxLength={500} value={programForm.summary} onChange={(e)=>setProgramForm({...programForm,summary:e.target.value})}/></label>
              <label className="block text-sm font-semibold">Description<textarea className={`${fieldClass} mt-1 min-h-28`} value={programForm.description} onChange={(e)=>setProgramForm({...programForm,description:e.target.value})}/></label>
              <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Start<input className={`${fieldClass} mt-1`} type="date" value={programForm.startsOn} onChange={(e)=>setProgramForm({...programForm,startsOn:e.target.value})}/></label><label className="text-sm font-semibold">End<input className={`${fieldClass} mt-1`} type="date" value={programForm.endsOn} onChange={(e)=>setProgramForm({...programForm,endsOn:e.target.value})}/></label></div>
              <label className="block text-sm font-semibold">Cover image<select className={`${fieldClass} mt-1`} value={programForm.heroImage} onChange={(e)=>setProgramForm({...programForm,heroImage:e.target.value})}><option value="">No image</option>{media.map((item)=><option key={item.id} value={item.path}>{item.alt_text || item.original_name}</option>)}</select></label>
              <label className="block text-sm font-semibold">Publication<select className={`${fieldClass} mt-1`} value={programForm.status} onChange={(e)=>setProgramForm({...programForm,status:e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <div className="flex gap-2"><button disabled={busy} className="rounded-lg bg-[#1B4332] px-4 py-2.5 text-sm font-bold text-white">Save program</button><button type="button" onClick={()=>{setProgramId(null);setProgramForm(emptyProgram)}} className="rounded-lg border border-[#D8D2C7] px-4 py-2.5 text-sm font-semibold">Clear</button></div>
            </div></form>
          </div>}
          {tab === "activities" && <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
            <div><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Activities</h2><p className="mt-1 text-sm text-[#68746A]">Choose a parent program or leave it standalone.</p></div><button onClick={()=>{setActivityId(null);setActivityForm(emptyActivity)}} className="rounded-lg bg-[#1B4332] px-3 py-2 text-sm font-semibold text-white">New activity</button></div>
              <div className="mt-5 space-y-3">{activities.map((item)=><div key={item.id} className="rounded-xl border border-[#E5DFD3] p-4"><div className="flex justify-between gap-3"><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-xs uppercase tracking-wide text-[#68746A]">{item.status} · {item.activity_date || "Date not set"} · {item.program_id ? programs.find((p)=>p.id===item.program_id)?.title || "Program" : "Standalone activity"}</p></div><div className="flex gap-2"><button onClick={()=>chooseActivity(item)} className="text-sm font-semibold text-[#315D3A] underline">Edit</button><button onClick={()=>deleteItem("activities",item.id)} className="text-sm font-semibold text-red-700 underline">Delete</button></div></div><p className="mt-3 text-sm leading-6 text-[#68746A]">{item.summary}</p></div>)}</div>
            </div>
            <form onSubmit={saveActivity} className="rounded-xl bg-[#F7F5F0] p-4 sm:p-5"><h3 className="font-bold">{activityId ? "Edit activity" : "New activity"}</h3><div className="mt-4 space-y-3">
              <label className="block text-sm font-semibold">Title<input required maxLength={180} className={`${fieldClass} mt-1`} value={activityForm.title} onChange={(e)=>setActivityForm({...activityForm,title:e.target.value})}/></label>
              <label className="block text-sm font-semibold">Parent program<select className={`${fieldClass} mt-1`} value={activityForm.programId} onChange={(e)=>setActivityForm({...activityForm,programId:e.target.value})}><option value="">Standalone activity</option>{programs.map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
              <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Date<input type="date" className={`${fieldClass} mt-1`} value={activityForm.activityDate} onChange={(e)=>setActivityForm({...activityForm,activityDate:e.target.value})}/></label><label className="text-sm font-semibold">Location<input className={`${fieldClass} mt-1`} maxLength={180} value={activityForm.location} onChange={(e)=>setActivityForm({...activityForm,location:e.target.value})}/></label></div>
              <label className="block text-sm font-semibold">Short summary<input className={`${fieldClass} mt-1`} maxLength={500} value={activityForm.summary} onChange={(e)=>setActivityForm({...activityForm,summary:e.target.value})}/></label>
              <label className="block text-sm font-semibold">Description<textarea className={`${fieldClass} mt-1 min-h-28`} value={activityForm.description} onChange={(e)=>setActivityForm({...activityForm,description:e.target.value})}/></label>
              <label className="block text-sm font-semibold">Image<select className={`${fieldClass} mt-1`} value={activityForm.imagePath} onChange={(e)=>setActivityForm({...activityForm,imagePath:e.target.value})}><option value="">No image</option>{media.map((item)=><option key={item.id} value={item.path}>{item.alt_text || item.original_name}</option>)}</select></label>
              <label className="block text-sm font-semibold">Publication<select className={`${fieldClass} mt-1`} value={activityForm.status} onChange={(e)=>setActivityForm({...activityForm,status:e.target.value})}><option value="draft">Draft</option><option value="published">Published</option></select></label>
              <div className="flex gap-2"><button disabled={busy} className="rounded-lg bg-[#1B4332] px-4 py-2.5 text-sm font-bold text-white">Save activity</button><button type="button" onClick={()=>{setActivityId(null);setActivityForm(emptyActivity)}} className="rounded-lg border border-[#D8D2C7] px-4 py-2.5 text-sm font-semibold">Clear</button></div>
            </div></form>
          </div>}
          {tab === "media" && <div className="grid gap-8 xl:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.3fr)]">
            <div><h2 className="text-xl font-bold">Image library</h2><p className="mt-1 text-sm leading-6 text-[#68746A]">Uploads are converted to WebP, resized to a 2,400 × 1,800 maximum, and limited to 8 MB per source image.</p><form onSubmit={upload} className="mt-5 space-y-3 rounded-xl bg-[#F7F5F0] p-4"><label className="block text-sm font-semibold">Image file<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className={`${fieldClass} mt-1`} onChange={(e)=>setUploadFile(e.target.files?.[0] || null)}/></label><label className="block text-sm font-semibold">Alternative text<input className={`${fieldClass} mt-1`} maxLength={300} value={uploadAlt} onChange={(e)=>setUploadAlt(e.target.value)} placeholder="Describe the image for screen readers"/></label><button disabled={busy} className="flex items-center gap-2 rounded-lg bg-[#1B4332] px-4 py-2.5 text-sm font-bold text-white"><ImagePlus size={16}/>{busy?"Uploading…":"Upload image"}</button></form>
            <h3 className="mt-7 font-bold">Public image slot</h3><p className="mt-1 text-sm leading-6 text-[#68746A]">Assign an image to a wired page slot. Existing options are listed; a custom key is useful after a developer adds it to a page template.</p><form onSubmit={saveSlot} className="mt-3 space-y-3 rounded-xl border border-[#E5DFD3] p-4"><label className="block text-sm font-semibold">Slot key<input required list="chi-image-slots" className={`${fieldClass} mt-1`} value={slotKey} onChange={(e)=>setSlotKey(e.target.value)} placeholder="home.hero"/><datalist id="chi-image-slots">{Array.from(new Set([...knownImageSlots,...slots.map((item)=>item.slot_key)])).map((key)=><option key={key} value={key}/>)}</datalist></label><label className="block text-sm font-semibold">Image<select className={`${fieldClass} mt-1`} value={slotMedia} onChange={(e)=>setSlotMedia(e.target.value)}><option value="">Clear slot</option>{media.map((item)=><option key={item.id} value={item.id}>{item.alt_text || item.original_name}</option>)}</select></label><button className="rounded-lg border border-[#D8D2C7] px-4 py-2 text-sm font-semibold">Save slot</button></form>
              {slots.length>0&&<ul className="mt-4 space-y-1 text-xs text-[#68746A]">{slots.map((slot)=><li key={slot.slot_key}><code>{slot.slot_key}</code> → media #{slot.media_id || "none"}</li>)}</ul>}
            </div>
            <div><h3 className="font-bold">Uploaded images ({media.length})</h3><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">{media.map((item)=><article key={item.id} className="overflow-hidden rounded-xl border border-[#E5DFD3] bg-white"><img src={item.path} alt={item.alt_text} loading="lazy" className="aspect-[4/3] w-full object-cover"/><div className="p-3"><p className="line-clamp-2 text-xs font-semibold">{item.alt_text || item.original_name || "Image"}</p><p className="mt-1 text-[10px] text-[#68746A]">{item.width}×{item.height} · {(item.bytes/1024).toFixed(0)} KB</p><label className="mt-2 block text-[10px] font-semibold">Alt text<input className={`${fieldClass} mt-1 px-2 py-1 text-xs`} value={item.alt_text} onChange={(e)=>setMedia(media.map((entry)=>entry.id===item.id?{...entry,alt_text:e.target.value}:entry))} onBlur={async(e)=>{try{await api(`/api/admin/media/${item.id}`,{method:"PUT",body:JSON.stringify({altText:e.target.value})});}catch(err){setNotice(err instanceof Error?err.message:"Could not update alt text.")}}}/></label><button type="button" onClick={()=>navigator.clipboard?.writeText(item.path)} className="mt-2 text-xs font-semibold text-[#315D3A] underline">Copy image path</button></div></article>)}</div></div>
          </div>}
        </section>
      </div>
    </main>
  );
}
