import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import ContourBackground from "@/components/reuseable/ContourBackground";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type Props = {
  params: Promise<{ slug: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params;

  // 🔥 Fetch current article
  const articleRes = await fetch(`${API_BASE}/news/${slug}`, {
    cache: "no-store", // or { next: { revalidate: 60 } } for ISR
  });

  if (!articleRes.ok) return notFound();

  const article = await articleRes.json();
  if (!article) return notFound();

  // 🔥 Fetch all published news (for prev/next)
  const listRes = await fetch(`${API_BASE}/news`, {
    cache: "no-store",
  });

  const newsList = await listRes.json();

  const currentIndex = newsList.findIndex(
    (n: any) => n.id === article.id
  );

  const prev = newsList[currentIndex - 1];
  const next = newsList[currentIndex + 1];

  // Convert Markdown → HTML
  const processed = await remark()
    .use(html)
    .process(article.content || "");

  const contentHtml = processed.toString();

  return (
    <ContourBackground
      background="#ffffff"
      lineColor="#7a825c"
      speed={0.03}
      resolution={20}
      levels={9}
    >
      <section className="light max-w-4xl mx-auto px-6 py-20">
        {/* BACK LINK */}
        <Link
          href="/press"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-10"
        >
          <IoIosArrowBack size={18} />
          <span>Back to news</span>
        </Link>

        {/* HERO */}
        <div className="relative h-[420px] rounded-2xl overflow-hidden mb-10">
          <Image
            src={article.bannerImage || article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="text-gray-500 mb-6">
          {article.publishedAt
            ? new Date(article.publishedAt).toDateString()
            : ""}
        </p>

        {/* CONTENT */}
        <article
          className="prose prose-lg md:prose-xl max-w-none
                     prose-headings:text-black
                     prose-p:text-gray-800
                     prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* PREV / NEXT */}
        <div className="mt-20 pt-10 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {prev ? (
            <Link
              href={`/news/${prev.slug}`}
              className="group flex items-center gap-4"
            >
              <IoIosArrowBack size={22} />
              <div>
                <p className="text-sm text-gray-500">Previous</p>
                <p className="text-lg group-hover:underline">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/news/${next.slug}`}
              className="group flex items-center gap-4 justify-end text-right"
            >
              <div>
                <p className="text-sm text-gray-500">Next</p>
                <p className="text-lg group-hover:underline">
                  {next.title}
                </p>
              </div>
              <IoIosArrowForward size={22} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </ContourBackground>
  );
}
