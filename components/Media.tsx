/* Renders a cover image when a url is present, otherwise the hatched placeholder. */
export function Media({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="img-cover" src={src} alt={alt} />;
  }
  return <div className="img-slot" aria-hidden="true" />;
}
