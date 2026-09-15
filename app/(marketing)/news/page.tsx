import { Suspense } from "react";
import { api } from "@/convex/_generated/api";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { fetchQuery } from "@/lib/convex-server";
import { NewsClient } from "./news-client";

export const metadata = buildMetadata({
  title: "News & Highlights",
  description:
    "What we've been building, teaching, publishing, and delivering across the actuarial and AI community, including past events and session highlights.",
  path: "/news",
});

// Next requires a literal here; it can't statically read an imported constant.
export const revalidate = 300; // 5 minutes

export default async function NewsPage() {
  const [newsItems, pastEvents] = await Promise.all([
    fetchQuery(api.content.listByTypeChronological, { type: "news" }),
    fetchQuery(api.content.listPastEvents, {}),
  ]);

  return (
    <>
      <JsonLd nodes={[breadcrumbSchema([{ label: "News", href: "/news" }])]} />
      <Suspense fallback={null}>
        <NewsClient newsItems={newsItems} pastEvents={pastEvents} />
      </Suspense>
    </>
  );
}
