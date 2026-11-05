export type BrandIdentityProps = { logoSrc?: string; className?: string };

// The approved flat logo can be supplied once, by the host, for both identities.
// Do not reconstruct the rendered reference or silently invent a replacement.
export function BrandIdentity({ logoSrc, className = "" }: BrandIdentityProps) {
  return (
    <span className={`brand ${className}`} aria-label="Converdive">
      {logoSrc && <img className="brand-mark" src={logoSrc} alt="" />}
      <span className="wordmark" aria-hidden="true">
        Converdive
      </span>
    </span>
  );
}
