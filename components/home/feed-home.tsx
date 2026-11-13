"use client";

import { useEffect, useState } from "react";
import { FeedComposer } from "@/components/home/feed-composer";
import { FeedPostCard } from "@/components/home/feed-post-card";
import { NewPostDialog } from "@/components/home/new-post-dialog";
import { SectionLabel } from "@/components/home/section-label";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { PlusIcon } from "@/components/shared/icons";
import {
  createdPostToPost,
  isCreatedPost,
  postsStorageKey,
  type CreatedPost,
  type Post,
  type Teacher,
} from "@/data/feed";
import type { Kid } from "@/data/kids";

type FeedHomeProps = {
  classroom: {
    room: string;
    eyebrow: string;
    salutation: string;
    summary: string;
  };
  demoPosts: Post[];
  kids: Kid[];
  teacher: Teacher;
};

export function FeedHome({
  classroom,
  demoPosts,
  kids,
  teacher,
}: FeedHomeProps) {
  const [createdPosts, setCreatedPosts] = useState<CreatedPost[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let storedPosts: CreatedPost[] = [];

    try {
      const raw = window.localStorage.getItem(postsStorageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed)) {
        storedPosts = parsed.filter(isCreatedPost);
      }
    } catch {
      storedPosts = [];
    }

    // Lectura única del store externo al montar; el primer render debe
    // coincidir con el HTML del servidor para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCreatedPosts(storedPosts);
  }, []);

  function handleCreate(post: CreatedPost) {
    const next = [...createdPosts, post];

    setCreatedPosts(next);

    try {
      window.localStorage.setItem(postsStorageKey, JSON.stringify(next));
    } catch {
      // El post sigue en memoria y solo se pierde al recargar.
    }

    setIsDialogOpen(false);
  }

  const feedPosts = [...[...createdPosts].reverse().map(createdPostToPost), ...demoPosts];

  return (
    <div className="flex h-screen min-w-[1008px] bg-cream">
      <AppSidebar
        activeItem="feed"
        room={classroom.room}
        teacher={teacher}
        publishTrigger={
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="mb-[18px] flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)]"
          >
            <PlusIcon />
            Nueva publicación
          </button>
        }
      />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-coral-strong">
              {classroom.eyebrow}
            </div>
            <h1 className="m-0 font-heading text-[30px] font-semibold text-heading">
              {classroom.salutation}
            </h1>
            <p className="mt-[5px] mb-0 text-[14.5px] text-secondary">
              {classroom.summary}
            </p>
          </div>

          <FeedComposer
            initial={teacher.initial}
            onCompose={() => setIsDialogOpen(true)}
          />

          <SectionLabel>PUBLICADO HOY</SectionLabel>

          <div className="flex flex-col gap-4">
            {feedPosts.map((post) => (
              <FeedPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <NewPostDialog
          open={isDialogOpen}
          kids={kids}
          onClose={() => setIsDialogOpen(false)}
          onCreate={handleCreate}
        />
      </main>
    </div>
  );
}
