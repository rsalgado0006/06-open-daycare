import { notFound } from "next/navigation";
import Link from "next/link";
import { LinkedParentsCard } from "@/components/kids/linked-parents-card";
import { Avatar } from "@/components/shared/avatar";
import {
  AlertTriangleIcon,
  ChevronLeftIcon,
  DaySummaryIcon,
} from "@/components/shared/icons";
import { getKid, room } from "@/data/kids";

type KidProfileProps = {
  params: Promise<{ id: string }>;
};

export async function KidProfile({ params }: KidProfileProps) {
  const { id } = await params;
  const kid = getKid(id);

  if (!kid) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[820px] px-10 pt-[34px] pb-20">
      <Link
        href="/kids"
        className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-secondary"
      >
        <ChevronLeftIcon />
        Volver a Niños
      </Link>

      <div className="flex flex-wrap items-start gap-[26px]">
        <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
          <div className="flex items-center gap-[18px]">
            <Avatar label={kid.initial} tone={kid.tone} size="hero" />

            <div className="flex-1">
              <h1 className="m-0 font-heading text-[28px] font-semibold text-heading">
                {kid.name}
              </h1>
              <p className="mt-[3px] mb-0 text-[15px] text-secondary">
                {kid.age} años · {room.name}
              </p>
            </div>

            <span
              title="Próximamente"
              className="rounded-xl border-[1.5px] border-edge bg-card px-4 py-[9px] text-[14px] font-bold text-nav"
            >
              Editar
            </span>
          </div>

          {kid.alert ? (
            <div className="flex gap-[14px] rounded-2xl bg-alert-panel px-[18px] py-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-alert-icon">
                <AlertTriangleIcon />
              </span>
              <div>
                <div className="mb-0.5 text-[15px] font-extrabold text-alert-title">
                  Alergias y notas
                </div>
                <div className="text-[14.5px] leading-[1.5] text-alert-copy">
                  {kid.alert.body}
                </div>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-edge bg-card">
            <div className="flex justify-between border-b border-action-line px-[18px] py-[15px]">
              <span className="text-[14.5px] text-secondary">
                Fecha de nacimiento
              </span>
              <span className="text-[14.5px] font-extrabold text-heading">
                {kid.birthDate}
              </span>
            </div>
            <div className="flex justify-between border-b border-action-line px-[18px] py-[15px]">
              <span className="text-[14.5px] text-secondary">Sala</span>
              <span className="text-[14.5px] font-extrabold text-heading">
                {room.short}
              </span>
            </div>
            <div className="flex justify-between px-[18px] py-[15px]">
              <span className="text-[14.5px] text-secondary">Ingreso</span>
              <span className="text-[14.5px] font-extrabold text-heading">
                {kid.admission}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-[300px] flex-none flex-col gap-[14px]">
          <span
            title="Próximamente"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-heading p-[13px] text-[15px] font-extrabold text-white"
          >
            <DaySummaryIcon />
            Resumen del día
          </span>

          <LinkedParentsCard
            kidId={kid.id}
            kidName={kid.name}
            parents={kid.parents}
          />
        </div>
      </div>
    </div>
  );
}
