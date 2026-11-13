import { Avatar, type AvatarTone } from "@/components/shared/avatar";
import type { LinkedParent, ParentRelation } from "@/data/kids";

type ParentRowProps = {
  parent: LinkedParent;
};

type ParentLabels = {
  detail: string;
  badge: string;
};

const RELATION_TONES: Record<ParentRelation, AvatarTone> = {
  Mamá: "lilac",
  Papá: "blue",
  "Tutor/a": "mint",
};

const ACTIVE_LABELS: Record<ParentRelation, ParentLabels> = {
  Mamá: { detail: "activa", badge: "ACTIVA" },
  Papá: { detail: "activo", badge: "ACTIVO" },
  "Tutor/a": { detail: "activo/a", badge: "ACTIVO/A" },
};

const PENDING_LABELS: ParentLabels = {
  detail: "invitación enviada",
  badge: "PENDIENTE",
};

export function ParentRow({ parent }: ParentRowProps) {
  const isActive = parent.status === "active";
  const tone = RELATION_TONES[parent.relation];
  const { detail, badge } = isActive
    ? ACTIVE_LABELS[parent.relation]
    : PENDING_LABELS;
  const relationLabel = `${parent.relation} · ${detail}`;

  return (
    <div className="flex items-center gap-3">
      <Avatar label={parent.initial} tone={tone} size="md" />

      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-extrabold text-heading">
          {parent.name}
        </div>
        <div className="text-[12.5px] text-meta">{relationLabel}</div>
      </div>

      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${
          isActive
            ? "bg-badge-achievement text-badge-achievement-ink"
            : "bg-badge-pending text-badge-pending-ink"
        }`}
      >
        {badge}
      </span>
    </div>
  );
}
