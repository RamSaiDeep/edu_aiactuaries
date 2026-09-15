import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { SectionHeader, EmptyState } from "@/components/marketing";
import { ContentCard } from "@/components/content/content-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "Upcoming events and workshops from the Sri Sathya Sai Institute of Actuaries.",
  path: "/events",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

/**
 * Upcoming events and workshops that a visitor can still attend.
 * Past events have moved to the News & Highlights tab (/news).
 */
export default async function EventsPage() {
  const items = await fetchQuery(api.content.listEventsAndWorkshops, {});

  const now = Date.now();
  // An item is past only once its whole run is over; undated items stay
  // upcoming — they are announcements whose dates are still being confirmed.
  const isPast = (item: (typeof items)[number]) => {
    const end = item.endDate ?? item.startDate;
    return end !== undefined && end < now;
  };

  const upcoming = items
    .filter((item) => !isPast(item))
    .sort((a, b) => (a.startDate ?? Infinity) - (b.startDate ?? Infinity));

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <JsonLd
        nodes={[breadcrumbSchema([{ label: "Events", href: "/events" }])]}
      />

      <SectionHeader
        as="h1"
        title="Events & Workshops"
        description="Webinars, hands-on workshops, and gatherings at the intersection of actuarial science and AI."
      />

      <section aria-labelledby="upcoming-heading" className="mb-16">
        <h2
          id="upcoming-heading"
          className="font-display text-2xl tracking-tight sm:text-3xl"
        >
          Upcoming
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          Sessions you can still register for, soonest first.
        </p>

        {upcoming.length === 0 ? (
          <EmptyState
            title="No events scheduled"
            description="New events and workshops will be listed here as dates are confirmed."
          />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((item, index) => (
              <ContentCard key={item._id} item={item} delayMs={index * 80} />
            ))}
          </div>
        )}
      </section>

      <aside className="border-t border-border pt-10 grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="font-display text-lg tracking-tight">Looking for past sessions?</h3>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            A permanent record of past workshops, webinars, and event highlights
            has moved to our News & Highlights section.
          </p>
          <Button asChild variant="outline" className="mt-4 gap-2">
            <Link href="/news?category=Past+Events">
              View Past Events in News
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-tight">Longer-form offerings</h3>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Looking for structured learning? Multi-week programs, certifications,
            and internships have their own dedicated home.
          </p>
          <Button asChild variant="outline" className="mt-4 gap-2">
            <Link href="/programs">
              Browse programs
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}
