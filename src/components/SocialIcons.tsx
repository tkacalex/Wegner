import { clsx } from "clsx";
import { site } from "@/lib/site";
import { InstagramIcon, TikTokIcon } from "./icons";

type Props = {
  className?: string;
  iconClassName?: string;
  variant?: "header" | "footer";
};

export function SocialIcons({ className, iconClassName, variant = "header" }: Props) {
  const base =
    variant === "footer"
      ? "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white/90 transition-colors hover:border-brand-red hover:text-white hover:bg-brand-red"
      : "inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-black";

  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <a
        href={site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram – Wegner Automobile"
        className={base}
      >
        <InstagramIcon className={clsx("h-5 w-5", iconClassName)} />
      </a>
      <a
        href={site.social.tiktok}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok – Wegner Automobile"
        className={base}
      >
        <TikTokIcon className={clsx("h-5 w-5", iconClassName)} />
      </a>
    </div>
  );
}
