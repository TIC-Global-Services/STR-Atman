"use client";

import { useState } from "react";
import { news } from "@/components/press/data/News";
import { IoSearch } from "react-icons/io5";
import UpdateCard from "../home/UpdateCard";

const ITEMS_PER_PAGE = 10;

export default function NewsList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const visible = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <section className=" light mx-auto px-6 py-24 md:px-14">
      {/* HEADER */}
      <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl mb-4">
            Official news & announcements
          </h1>
          <p className="text-[#717580] max-w-xl">
            This space features verified updates, media coverage, and official
            announcements related to Silambarasan TR. From film launches to
            major milestones, every update here reflects accurate and
            authenticated information.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-[360px]">
          <IoSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717580]"
          />
          <input
            type="text"
            placeholder="Search news"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-black/20 
                       outline-none focus:border-black transition"
          />
        </div>
      </div>

      {/* GRID */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {visible.map((item) => (
            <UpdateCard
              key={item.slug}
              title={item.title}
              img={item.image}
              desc={item.excerpt}
              slug={`/news/${item.slug}`}
              isActive
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-[#717580] mt-20">No results found.</p>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-20">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full border border-black/20 
                       disabled:opacity-40 hover:border-black transition"
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                  border transition ${
                    page === pageNum
                      ? "bg-black text-white border-black"
                      : "border-black/20 hover:border-black"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full border border-black/20 
                       disabled:opacity-40 hover:border-black transition"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
