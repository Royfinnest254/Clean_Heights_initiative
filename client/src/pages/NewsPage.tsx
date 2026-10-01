import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type Story = { id: number; slug: string; title: string; excerpt: string; content?: string; author: string; date: string; category: string; image: string; gallery?: string[] };

function NewsCard({ story }: { story: Story }) {
  return <Link href={`/news/${story.slug}`} className="group overflow-hidden rounded-2xl border border-[#E5DFD3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div className="aspect-[16/10] overflow-hidden bg-[#EAF1E8]">{story.image && <img src={story.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />}</div>
    <div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-[#A65732]">{story.category || "News"} · {story.date}</p><h2 className="mt-2 font-serif text-xl font-bold text-[#1B4332]">{story.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#68746A]">{story.excerpt}</p><span className="mt-4 inline-block text-sm font-bold text-[#315D3A]">Read story →</span></div>
  </Link>;
}

export default function NewsPage() {
  const [, params] = useRoute("/news/:slug");
  const slug = params?.slug;
  const [stories, setStories] = useState<Story[]>([]);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    const endpoint = slug ? `/api/news/${encodeURIComponent(slug)}` : "/api/news?limit=30";
    fetch(endpoint, { cache: "no-cache", signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Stories could not be loaded.");
      if (slug) setStory(data.post); else setStories(data.posts || []);
    }).catch((reason) => { if (reason.name !== "AbortError") setError(reason.message || "Stories could not be loaded."); });
    return () => controller.abort();
  }, [slug]);
  useEffect(() => {
    if (!story || !slug) return;
    const title = `${story.title} | Clean Heights Initiative`;
    const description = story.excerpt || "A community story from Clean Heights Initiative.";
    document.title = title;
    const setMeta = (key: string, content: string, property = false) => {
      const selector = property ? `meta[property="${key}"]` : `meta[name="${key}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) { element = document.createElement("meta"); element.setAttribute(property ? "property" : "name", key); document.head.appendChild(element); }
      element.content = content;
    };
    setMeta("description", description);
    setMeta("og:type", "article", true);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", `${window.location.origin}/news/${encodeURIComponent(slug)}`, true);
    if (story.image) setMeta("og:image", story.image, true);
  }, [story, slug]);

  return <div className="min-h-screen bg-[#F7F5F0] text-[#26342C]"><Navigation />
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
      <Link href="/" className="text-sm font-semibold text-[#315D3A]">← Home</Link>
      {slug ? story ? <article className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-[#E5DFD3] bg-white shadow-sm">
        {story.image && <img src={story.image} alt="" className="max-h-[520px] w-full object-cover" />}
        <div className="p-6 sm:p-10"><p className="text-xs font-bold uppercase tracking-widest text-[#A65732]">{story.category} · {story.date}{story.author ? ` · ${story.author}` : ""}</p><h1 className="mt-3 font-serif text-3xl font-bold text-[#1B4332] sm:text-5xl">{story.title}</h1><p className="mt-5 text-lg leading-8 text-[#68746A]">{story.excerpt}</p><div className="mt-8 whitespace-pre-wrap text-base leading-8 text-[#35433A]">{story.content}</div>{story.gallery?.length ? <div className="mt-8 grid gap-4 sm:grid-cols-2">{story.gallery.map((image) => <img key={image} src={image} alt="" loading="lazy" className="rounded-xl" />)}</div> : null}</div>
      </article> : <p className="mt-10">{error || "Loading story…"}</p> : <><p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-[#A65732]">Field notes and community updates</p><h1 className="mt-2 font-serif text-4xl font-bold text-[#1B4332] sm:text-5xl">Latest News</h1>{error ? <p className="mt-8 rounded-xl bg-white p-5">{error}</p> : stories.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{stories.map((item) => <NewsCard key={item.id} story={item} />)}</div> : <p className="mt-8 rounded-xl bg-white p-5">No news stories have been published yet.</p>}</>}
    </main><Footer /></div>;
}
