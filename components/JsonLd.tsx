/**
 * Renders a JSON-LD structured-data block as a server-rendered <script>, so it's
 * in the initial HTML for Google rich results and LLM crawlers. Not client JS.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
