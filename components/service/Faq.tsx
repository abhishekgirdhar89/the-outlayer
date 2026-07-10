import type { ServiceFaq } from "@/lib/types";

/**
 * FAQ accordion using native <details>/<summary> — accessible and fully
 * server-rendered (no client JS), so the Q&As are in the crawlable HTML and
 * pair with the FAQPage JSON-LD.
 *
 * Shared `name` makes it an exclusive accordion (opening one closes the others),
 * and the first item starts open — so the section never balloons in height.
 * Older browsers that ignore `name` still get the first-open default and simply
 * allow multiple panels open (graceful degradation).
 */
export function Faq({ tag, head, faqs }: { tag: string; head: string; faqs: ServiceFaq[] }) {
  return (
    <div className="wrap">
      {tag && <p className="b-tag reveal r2">{tag}</p>}
      {head && <h2 className="b-head reveal r2">{head}</h2>}
      <div className="faq-list reveal r2 d2">
        {faqs.map((f, i) => (
          <details className="faq-item" key={i} name="service-faq" open={i === 0}>
            <summary>
              {f.q}
              <span className="faq-chev" aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
