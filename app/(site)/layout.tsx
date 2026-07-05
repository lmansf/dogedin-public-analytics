import SiteChrome from "@/components/SiteChrome";

// The full-page chrome (header + footer). The /embed route skips this layout
// so the dashboard can be iframed on the main site without double branding.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
