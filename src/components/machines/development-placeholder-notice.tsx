import { DEVELOPMENT_PLACEHOLDER_LABEL } from "@/lib/machines/constants";

export function DevelopmentPlaceholderNotice() {
  return (
    <aside
      aria-label="Development content warning"
      className="development-notice"
    >
      <strong>{DEVELOPMENT_PLACEHOLDER_LABEL}</strong>
      <p>
        This record exists only to verify the website architecture. It is not a
        real MINDEQ product and must never be published as product information.
      </p>
    </aside>
  );
}
