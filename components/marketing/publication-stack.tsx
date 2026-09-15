import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Book {
  id: string;
  title: string;
  href: string;
  cover?: string; // URL for actual image when available
  label?: string;
}

const defaultBooks: Book[] = [
  {
    id: "book-1",
    title: "The Full Stack Actuary",
    href: "https://fullstackactuary.com/",
  },
  {
    id: "book-2",
    title: "Agentic AI for Actuaries",
    href: "https://aiforactuaries.sssia.org",
  },
  {
    id: "book-3",
    title: "Agentic AI in Financial Mathematics",
    href: "https://fm-companion-one.vercel.app/",
    label: "Book",
  },
  {
    id: "book-4",
    title: "SUTRA",
    href: "https://sutra.sssia.org/",
    label: "Platform",
  },
  {
    id: "book-5",
    title: "Indian Actuaries Climate Index",
    href: "https://climateindex.sssia.org", // Fallback until official URL is provided
    label: "Index",
  },
];

function linkProps(href: string) {
  const external = href.startsWith("http");
  return {
    href,
    target: external ? "_blank" : undefined,
    rel: external ? "noopener noreferrer" : undefined,
  };
}

// Grid placement by position. Mobile: 2 columns with the last card centred.
// Desktop: a 6-column grid laid out as 3 over 2, the bottom row sitting between
// the top row's cards, with alternate cards dropped for a staggered rhythm.
// Stagger uses margin rather than transforms so the GSAP entrance (which writes
// inline transforms on .hero-book) can't clobber it.
const placement = [
  "md:col-span-2",
  "md:col-span-2 md:mt-8",
  "md:col-span-2",
  "md:col-span-2 md:col-start-2",
  "col-span-2 w-[calc(50%-0.4375rem)] sm:w-[calc(50%-0.5rem)] justify-self-center md:w-full md:col-span-2 md:mt-8",
];

export function PublicationStack({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center lg:items-end w-full", className)}>
      <div className="text-right mb-8 lg:mb-12 hero-books-label">
        <span className="text-xs font-bold tracking-widest text-[#F26A21] uppercase block">
          Platforms & Publications / 05
        </span>
      </div>

      <div className="grid grid-cols-2 items-start gap-3.5 sm:gap-4 md:grid-cols-6 md:gap-x-5 md:gap-y-6 w-full max-w-sm md:max-w-[560px] mx-auto lg:mx-0 px-2 md:px-0 mt-8">
        {defaultBooks.map((book, idx) => {
          return (
            <Link
              key={book.id}
              {...linkProps(book.href)}
              className={cn("hero-book group block", placement[idx])}
              aria-label={`${book.title} — publication`}
            >
              <div className="relative aspect-[4/5] w-full p-3.5 md:p-4 lg:p-5 bg-white border border-[#0A192F]/10 shadow-sm overflow-hidden flex flex-col justify-center items-center text-center transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-[#F26A21]/40">
                <div className="absolute left-0 bottom-0 h-[2px] w-full bg-[#F26A21] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />

                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2.5 lg:gap-3 h-full">
                    <div className="text-[8px] md:text-[9px] lg:text-[10px] font-bold tracking-widest text-[#0A192F]/40 uppercase">
                      {book.label || "Publication"}
                    </div>
                    <div className="w-5 lg:w-8 h-[2px] bg-[#F26A21]" />
                    <h3 className="font-display text-xs sm:text-sm md:text-base lg:text-lg text-[#0A192F] group-hover:text-[#F26A21] transition-colors leading-tight">
                      {book.title}
                    </h3>
                  </div>
                )}

                {/* Hover hint, kept inside the card so it never collides with a neighbour */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-max opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none hidden md:flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-[#F26A21]">
                  Read More <ArrowRight className="size-3" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
