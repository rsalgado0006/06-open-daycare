"use client";

import { useEffect, useState } from "react";
import { LinkParentDialog } from "@/components/kids/link-parent-dialog";
import { ParentRow } from "@/components/kids/parent-row";
import { PlusOutlineIcon } from "@/components/shared/icons";
import {
  inviteToLinkedParent,
  isParentInvite,
  parentInvitesStorageKey,
  type LinkedParent,
  type ParentInvite,
} from "@/data/kids";

type LinkedParentsCardProps = {
  kidId: string;
  kidName: string;
  parents: LinkedParent[];
};

export function LinkedParentsCard({
  kidId,
  kidName,
  parents,
}: LinkedParentsCardProps) {
  const [invites, setInvites] = useState<ParentInvite[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let storedInvites: ParentInvite[] = [];

    try {
      const raw = window.localStorage.getItem(parentInvitesStorageKey);
      const parsed: unknown = raw ? JSON.parse(raw) : [];

      if (Array.isArray(parsed)) {
        storedInvites = parsed.filter(isParentInvite);
      }
    } catch {
      storedInvites = [];
    }

    // Lectura única del store externo al montar; el primer render debe
    // coincidir con el HTML del servidor para no romper la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInvites(storedInvites);
  }, []);

  const kidInvites = invites.filter((invite) => invite.kidId === kidId);
  const existingEmails = kidInvites.map((invite) => invite.email);

  function handleInvite(invite: ParentInvite) {
    const nextInvites = [...invites, invite];
    setInvites(nextInvites);

    try {
      window.localStorage.setItem(
        parentInvitesStorageKey,
        JSON.stringify(nextInvites),
      );
    } catch {
      // localStorage bloqueado o lleno: la invitación sigue en memoria
    }

    setIsDialogOpen(false);
  }

  return (
    <div className="rounded-2xl border border-edge bg-card px-[18px] py-4">
      <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[.8px] text-label">
        PADRES VINCULADOS
      </div>

      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => (
          <ParentRow key={parent.id} parent={parent} />
        ))}

        {kidInvites.map((invite) => (
          <ParentRow key={invite.id} parent={inviteToLinkedParent(invite)} />
        ))}

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="flex cursor-pointer items-center gap-3 pt-2 text-left"
        >
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[var(--color-dashed)] text-media-ink">
            <PlusOutlineIcon />
          </span>
          <span className="text-[14.5px] font-extrabold text-edit">
            Vincular otro padre
          </span>
        </button>
      </div>

      <LinkParentDialog
        open={isDialogOpen}
        kidId={kidId}
        kidName={kidName}
        existingEmails={existingEmails}
        onClose={() => setIsDialogOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
