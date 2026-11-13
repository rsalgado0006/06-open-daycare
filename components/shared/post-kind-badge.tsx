import { postKindLabels, type PostKind } from "@/data/feed";

type KindStyle = {
  background: string;
  text: string;
  dot: string;
};

const KIND_STYLES: Record<PostKind, KindStyle> = {
  food: {
    background: "bg-badge-food",
    text: "text-badge-food-ink",
    dot: "bg-badge-food-ink",
  },
  nap: {
    background: "bg-badge-nap",
    text: "text-badge-nap-ink",
    dot: "bg-badge-nap-ink",
  },
  activity: {
    background: "bg-badge-activity",
    text: "text-badge-activity-ink",
    dot: "bg-badge-activity-ink",
  },
  achievement: {
    background: "bg-badge-achievement",
    text: "text-badge-achievement-ink",
    dot: "bg-badge-achievement-ink",
  },
  mood: {
    background: "bg-badge-mood",
    text: "text-badge-mood-ink",
    dot: "bg-badge-mood-ink",
  },
  photo: {
    background: "bg-badge-photo",
    text: "text-badge-photo-ink",
    dot: "bg-badge-photo-ink",
  },
  announcement: {
    background: "bg-badge-announcement",
    text: "text-badge-announcement-ink",
    dot: "bg-badge-announcement-ink",
  },
};

type PostKindBadgeProps = {
  kind: PostKind;
};

export function PostKindBadge({ kind }: PostKindBadgeProps) {
  const { background, text, dot } = KIND_STYLES[kind];

  return (
    <div
      className={`flex items-center gap-[7px] rounded-full px-3 py-1.5 ${background}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span className={`text-[12px] font-extrabold tracking-[.5px] ${text}`}>
        {postKindLabels[kind]}
      </span>
    </div>
  );
}
