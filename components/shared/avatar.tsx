import type { ReactNode } from "react";

export type AvatarTone =
  | "peach"
  | "sky"
  | "lilac"
  | "periwinkle"
  | "rose"
  | "mint"
  | "sun"
  | "violet"
  | "blue";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "card" | "hero";

type AvatarProps = {
  label: string;
  tone: AvatarTone;
  size: AvatarSize;
  icon?: ReactNode;
};

const SIZE_CLASSES: Record<AvatarSize, { box: string; text: string }> = {
  xs: { box: "h-[26px] w-[26px]", text: "text-[13px]" },
  sm: { box: "h-[38px] w-[38px]", text: "text-[16px]" },
  md: { box: "h-[40px] w-[40px]", text: "text-[16px]" },
  lg: { box: "h-[44px] w-[44px]", text: "text-[17px]" },
  card: { box: "h-[48px] w-[48px]", text: "text-[19px]" },
  hero: { box: "h-[84px] w-[84px]", text: "text-[34px]" },
};

const TONE_CLASSES: Record<AvatarTone, string> = {
  peach: "bg-avatar-peach text-white",
  sky: "bg-avatar-sky text-avatar-sky-ink",
  lilac: "bg-avatar-lilac text-white",
  periwinkle: "bg-avatar-periwinkle text-avatar-periwinkle-ink",
  rose: "bg-avatar-rose text-avatar-rose-ink",
  mint: "bg-avatar-mint text-avatar-mint-ink",
  sun: "bg-avatar-sun text-avatar-sun-ink",
  violet: "bg-avatar-violet text-avatar-violet-ink",
  blue: "bg-avatar-blue text-white",
};

export function Avatar({ label, tone, size, icon }: AvatarProps) {
  const { box, text } = SIZE_CLASSES[size];

  return (
    <div
      className={`flex flex-none items-center justify-center rounded-full font-heading font-semibold ${box} ${text} ${TONE_CLASSES[tone]}`}
    >
      {icon ?? label}
    </div>
  );
}
