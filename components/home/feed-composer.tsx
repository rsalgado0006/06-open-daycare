import { Avatar } from "@/components/shared/avatar";
import { CameraIcon } from "@/components/shared/icons";

type FeedComposerProps = {
  initial: string;
  onCompose: () => void;
};

export function FeedComposer({ initial, onCompose }: FeedComposerProps) {
  return (
    <button
      type="button"
      onClick={onCompose}
      className="mb-6 flex w-full cursor-pointer items-center gap-[14px] rounded-[18px] border border-edge bg-card px-[18px] py-[14px] text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
    >
      <Avatar label={initial} tone="peach" size="md" />
      <span className="flex-1 text-[15px] text-meta">
        Compartí un momento…
      </span>
      <span className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-nav-active text-heart">
        <CameraIcon />
      </span>
    </button>
  );
}
