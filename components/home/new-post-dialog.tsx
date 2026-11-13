"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { Avatar } from "@/components/shared/avatar";
import { ImageIcon, PhotoPlusIcon } from "@/components/shared/icons";
import {
  postKindLabels,
  postKinds,
  type CreatedPost,
  type CreatedPostTarget,
  type PostKind,
} from "@/data/feed";
import type { Kid } from "@/data/kids";

type NewPostDialogProps = {
  open: boolean;
  kids: Kid[];
  onClose: () => void;
  onCreate: (post: CreatedPost) => void;
};

type FormErrors = {
  target?: string;
  description?: string;
};

const KIND_PILL_CLASSES: Record<PostKind, string> = {
  food: "bg-badge-food-ink text-white",
  nap: "bg-badge-nap text-badge-nap-ink",
  activity: "bg-badge-activity-ink text-white",
  achievement: "bg-badge-achievement text-badge-achievement-ink",
  mood: "bg-badge-mood text-badge-mood-ink",
  photo: "bg-badge-photo text-badge-photo-ink",
  announcement: "bg-badge-announcement text-badge-announcement-ink",
};

const KIND_OUTLINE_CLASSES: Record<PostKind, string> = {
  food: "outline-badge-food-ink",
  nap: "outline-badge-nap-ink",
  activity: "outline-badge-activity-ink",
  achievement: "outline-badge-achievement-ink",
  mood: "outline-badge-mood-ink",
  photo: "outline-badge-photo-ink",
  announcement: "outline-badge-announcement-ink",
};

const DEFAULT_KIND: PostKind = "activity";

function firstName(name: string) {
  return name.split(" ")[0];
}

function defaultSelection(kids: Kid[]): string[] {
  return kids[0] ? [kids[0].id] : [];
}

function isEveryKidSelected(kids: Kid[], selectedKidIds: string[]) {
  return (
    kids.length > 0 && kids.every((kid) => selectedKidIds.includes(kid.id))
  );
}

function createPostId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `post-${Date.now()}`;
}

export function NewPostDialog({
  open,
  kids,
  onClose,
  onCreate,
}: NewPostDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const firstKidChipRef = useRef<HTMLButtonElement>(null);
  const formId = useId();

  const [selectedKidIds, setSelectedKidIds] = useState<string[]>(() =>
    defaultSelection(kids),
  );
  const [kind, setKind] = useState<PostKind>(DEFAULT_KIND);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isRoomSelected = isEveryKidSelected(kids, selectedKidIds);

  const titleId = `${formId}-title`;
  const descriptionId = `${formId}-description`;
  const targetLabelId = `${formId}-target-label`;
  const kindLabelId = `${formId}-kind-label`;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const scrollParent = dialogRef.current?.closest("main");

    if (!scrollParent) {
      return;
    }

    const previousOverflow = scrollParent.style.overflow;
    scrollParent.style.overflow = "hidden";

    return () => {
      scrollParent.style.overflow = previousOverflow;
    };
  }, [open]);

  function clearDescriptionError() {
    setErrors((current) =>
      current.description ? { ...current, description: undefined } : current,
    );
  }

  function clearTargetError() {
    setErrors((current) =>
      current.target ? { ...current, target: undefined } : current,
    );
  }

  function resetForm() {
    setSelectedKidIds(defaultSelection(kids));
    setKind(DEFAULT_KIND);
    setDescription("");
    setErrors({});
  }

  function toggleKid(kidId: string) {
    setSelectedKidIds((current) =>
      current.includes(kidId)
        ? current.filter((id) => id !== kidId)
        : [...current, kidId],
    );
    clearTargetError();
  }

  function toggleRoom() {
    setSelectedKidIds((current) =>
      isEveryKidSelected(kids, current) ? [] : kids.map((kid) => kid.id),
    );
    clearTargetError();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedKids = kids.filter((kid) =>
      selectedKidIds.includes(kid.id),
    );
    const body = description.trim();
    const nextErrors: FormErrors = {};

    if (selectedKids.length === 0) {
      nextErrors.target = "Elegí al menos un destinatario.";
    }

    if (!body) {
      nextErrors.description = "Escribí la descripción.";
    }

    if (nextErrors.target || nextErrors.description) {
      setErrors(nextErrors);

      if (nextErrors.target) {
        firstKidChipRef.current?.focus();
      } else {
        descriptionRef.current?.focus();
      }

      return;
    }

    const target: CreatedPostTarget =
      selectedKids.length === kids.length
        ? { type: "room" }
        : {
            type: "kids",
            kids: selectedKids.map((kid) => ({
              kidId: kid.id,
              kidName: firstName(kid.name),
            })),
          };

    onCreate({
      id: createPostId(),
      kind,
      target,
      body,
      createdAt: new Date().toISOString(),
    });
  }

  function handleDialogClose() {
    resetForm();
    onClose();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
      onClose={handleDialogClose}
      className="m-auto w-[min(580px,calc(100vw-48px))] max-h-[calc(100vh-64px)] overflow-hidden rounded-[24px] border border-edge bg-auth-bg p-0 text-heading shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] backdrop:bg-[rgba(63,54,46,.45)]"
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-64px)] flex-col"
      >
        <div className="flex flex-none items-center justify-between border-b border-edge px-[26px] py-5">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="cursor-pointer text-[15px] font-bold text-secondary"
          >
            Cancelar
          </button>
          <h2
            id={titleId}
            className="m-0 font-heading text-[18px] font-semibold text-heading"
          >
            Nueva publicación
          </h2>
          <button
            type="submit"
            className="cursor-pointer text-[15px] font-extrabold text-coral-strong"
          >
            Publicar
          </button>
        </div>

        <div className="overflow-y-auto px-[26px] py-6">
          <div
            id={targetLabelId}
            className="mb-[10px] text-[12px] font-extrabold tracking-[.7px] text-secondary"
          >
            PARA
          </div>
          <div
            role="group"
            aria-labelledby={targetLabelId}
            className={`flex flex-wrap gap-[9px] ${
              errors.target ? "mb-[6px]" : "mb-[22px]"
            }`}
          >
            {kids.map((kid, index) => {
              const isSelected = selectedKidIds.includes(kid.id);

              return (
                <button
                  key={kid.id}
                  ref={index === 0 ? firstKidChipRef : undefined}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleKid(kid.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] pl-[6px] text-[14px] font-bold ${
                    isSelected
                      ? "border-heading bg-heading text-white"
                      : "border-edge bg-card text-nav"
                  }`}
                >
                  <Avatar label={kid.initial} tone={kid.tone} size="xs" />
                  {firstName(kid.name)}
                </button>
              );
            })}
            <button
              type="button"
              role="checkbox"
              aria-checked={isRoomSelected}
              onClick={toggleRoom}
              className={`cursor-pointer rounded-full border-[1.5px] px-4 py-[6px] text-[14px] font-bold ${
                isRoomSelected
                  ? "border-heading bg-heading text-white"
                  : "border-edge bg-card text-nav"
              }`}
            >
              Toda la sala
            </button>
          </div>
          {errors.target ? (
            <p
              id={`${formId}-target-error`}
              role="alert"
              className="mt-0 mb-[22px] text-[12.5px] font-bold text-coral-strong"
            >
              {errors.target}
            </p>
          ) : null}

          <div
            id={kindLabelId}
            className="mb-[10px] text-[12px] font-extrabold tracking-[.7px] text-secondary"
          >
            TIPO
          </div>
          <div
            role="radiogroup"
            aria-labelledby={kindLabelId}
            className="mb-[22px] flex flex-wrap gap-[9px]"
          >
            {postKinds.map((item) => {
              const isSelected = kind === item;

              return (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setKind(item)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-[13.5px] font-extrabold capitalize ${KIND_PILL_CLASSES[item]} ${
                    isSelected
                      ? `outline-2 outline-offset-2 ${KIND_OUTLINE_CLASSES[item]}`
                      : ""
                  }`}
                >
                  {postKindLabels[item].toLowerCase()}
                </button>
              );
            })}
          </div>

          <label
            htmlFor={descriptionId}
            className="mb-[10px] block text-[12px] font-extrabold tracking-[.7px] text-secondary"
          >
            DESCRIPCIÓN
          </label>
          <div className="mb-[22px]">
            <textarea
              id={descriptionId}
              ref={descriptionRef}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearDescriptionError();
              }}
              placeholder="Contá cómo le fue hoy…"
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? `${descriptionId}-error` : undefined
              }
              className={`min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-heading outline-none placeholder:text-placeholder ${
                errors.description
                  ? "border-coral-strong"
                  : "border-field-border"
              }`}
            />
            {errors.description ? (
              <p
                id={`${descriptionId}-error`}
                role="alert"
                className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
              >
                {errors.description}
              </p>
            ) : null}
          </div>

          <div className="mb-[10px] text-[12px] font-extrabold tracking-[.7px] text-secondary">
            FOTOS
          </div>
          <div className="flex gap-3">
            <span
              title="Próximamente"
              className="flex h-24 w-24 items-center justify-center rounded-[14px] border border-edge bg-media text-chevron"
            >
              <ImageIcon size={26} />
            </span>
            <span
              title="Próximamente"
              className="flex h-24 w-24 flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.5px] border-dashed border-media-line bg-media text-media-ink"
            >
              <PhotoPlusIcon />
              <span className="text-[12px]">Agregar</span>
            </span>
          </div>
        </div>
      </form>
    </dialog>
  );
}
