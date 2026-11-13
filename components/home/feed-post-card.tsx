import { Avatar } from "@/components/shared/avatar";
import { PostKindBadge } from "@/components/shared/post-kind-badge";
import {
  CommentIcon,
  HeartIcon,
  ImageIcon,
  MegaphoneIcon,
} from "@/components/shared/icons";
import { formatKidNameList, formatPostAudience, type Post } from "@/data/feed";

type FeedPostCardProps = {
  post: Post;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  const { target } = post;
  const isRoom = target.type === "room";
  const title = isRoom
    ? "Anuncio general"
    : formatKidNameList(
        target.type === "kid"
          ? [target.kidName]
          : target.type === "kids"
            ? target.kidNames
            : [],
      );

  return (
    <article className="rounded-[20px] border border-edge bg-card px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        {isRoom ? (
          <Avatar
            label="Anuncio general"
            tone="periwinkle"
            size="lg"
            icon={<MegaphoneIcon />}
          />
        ) : (
          <Avatar label={title.charAt(0)} tone="sky" size="lg" />
        )}
        <div className="flex-1">
          <div className="font-heading text-[16.5px] font-semibold text-heading">
            {title}
          </div>
          <div className="text-[12.5px] text-meta">
            {post.time} · {post.author}
          </div>
        </div>
        <PostKindBadge kind={post.kind} />
      </div>

      <div className="mb-[10px] text-[12.5px] text-meta">
        {formatPostAudience(target)}
      </div>

      <p className="m-0 text-[15.5px] leading-[1.55] text-copy">{post.body}</p>

      {post.photoCaption ? (
        <span
          title="Próximamente"
          className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-media-line bg-media text-media-ink"
        >
          <ImageIcon />
          <span className="text-[13.5px]">{post.photoCaption}</span>
        </span>
      ) : null}

      <div className="mt-4 flex items-center gap-[18px] border-t border-action-line pt-[14px]">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-heart">
          <HeartIcon />
          {post.likes}
        </span>
        <span
          title="Próximamente"
          className="flex items-center gap-[7px] text-[14px] font-bold text-secondary"
        >
          <CommentIcon />
          {post.comments}
        </span>
        <span className="flex-1" />
        <span
          title="Próximamente"
          className="text-[14px] font-extrabold text-edit"
        >
          Editar
        </span>
      </div>
    </article>
  );
}
