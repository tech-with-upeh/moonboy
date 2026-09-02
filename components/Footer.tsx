import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  { label: "home", href: "/" },
  { label: "about me", href: "/about-me" },
  { label: "privacy policy", href: "/privacy-policy" },
];

interface FooterProps {
  src: string | [string, string];
  alt: string | [string, string];
  isdual?: boolean;
}

const FLOURISH_FILTER =
  "[filter:brightness(0)_saturate(100%)_invert(20%)_sepia(54%)_saturate(1826%)_hue-rotate(215deg)_brightness(93%)_contrast(93%)] " +
  "dark:[filter:brightness(0)_saturate(100%)_invert(97%)_sepia(9%)_saturate(750%)_hue-rotate(196deg)_brightness(101%)_contrast(101%)]";

export default function Footer({ src, alt, isdual = false }: FooterProps) {
  const leftImage = Array.isArray(src) ? src[0] : src;
  const rightImage = Array.isArray(src) ? src[1] : src;
  const leftAlt = Array.isArray(alt) ? alt[0] : alt;
  const rightAlt = Array.isArray(alt) ? alt[1] : alt;

  return (
    <footer className="px-6 pb-16 pt-20 md:px-10">
      <div className="mx-auto max-w-page">
        <div className={isdual ? "grid grid-cols-1 items-center gap-8 md:grid-cols-[180px_minmax(0,1fr)_180px] md:gap-12" : "flex flex-col items-center"}>
          {isdual && (
            <div className="relative hidden h-52 w-44 justify-self-center md:block">
              <Image src={leftImage} alt={leftAlt} fill className={`object-contain ${FLOURISH_FILTER}`} sizes="176px" />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-center font-script text-4xl text-ink sm:text-5xl">Thanks for stopping by!</h2>

            <div className="mx-auto mt-8 max-w-[360px]">
              <div className="hairline" />
              <nav className="flex flex-col items-center gap-4 py-5">
                {FOOTER_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="font-ui text-[15px] text-ink transition-colors hover:text-moon-deep">
                    {link.label}
                  </Link>
                ))}
                <Link href="/contact" className="mt-2  px-5 py-2 font-ui text-[12px] font-semibold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-sky">
                  Send a Message
                </Link>
              </nav>
              <div className="hairline" />
            </div>
          </div>

          {isdual && (
            <div className="relative hidden h-52 w-44 justify-self-center md:block">
              <Image src={rightImage} alt={rightAlt} fill className={`object-contain ${FLOURISH_FILTER}`} sizes="176px" />
            </div>
          )}
        </div>

        {!isdual && (
          <div className="relative mx-auto mt-10 h-36 w-28">
            <Image src={leftImage} alt={leftAlt} fill className="object-contain" sizes="112px" />
          </div>
        )}
      </div>
    </footer>
  );
}
