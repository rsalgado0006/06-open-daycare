export type PostKind =
  | "food"
  | "nap"
  | "activity"
  | "achievement"
  | "mood"
  | "photo"
  | "announcement";

export const postKinds: PostKind[] = [
  "food",
  "nap",
  "activity",
  "achievement",
  "mood",
  "photo",
  "announcement",
];

export const postKindLabels: Record<PostKind, string> = {
  food: "COMIDA",
  nap: "SIESTA",
  activity: "ACTIVIDAD",
  achievement: "LOGRO",
  mood: "ÁNIMO",
  photo: "FOTO",
  announcement: "ANUNCIO",
};

export type PostTarget =
  | { type: "kid"; kidName: string }
  | { type: "kids"; kidNames: string[] }
  | { type: "room" };

export type Post = {
  id: string;
  kind: PostKind;
  target: PostTarget;
  time: string;
  author: string;
  body: string;
  likes: number;
  comments: number;
  photoCaption?: string;
};

// Publicación creada desde el pop-up, tal como se guarda en localStorage.
// «kid» es el formato legacy de la primera versión; se sigue aceptando al leer
// localStorage para no descartar posts ya guardados.
export type CreatedPostKid = {
  kidId: string;
  kidName: string;
};

export type CreatedPostTarget =
  | { type: "kid"; kidId: string; kidName: string }
  | { type: "kids"; kids: CreatedPostKid[] }
  | { type: "room" };

export type CreatedPost = {
  id: string;
  kind: PostKind;
  target: CreatedPostTarget;
  body: string;
  createdAt: string;
};

export const postsStorageKey = "opendaycare:posts:v1";

export type Teacher = {
  name: string;
  initial: string;
  role: string;
};

export const teacher: Teacher = {
  name: "Caro Giménez",
  initial: "C",
  role: "Maestra · Soles",
};

export const classroom = {
  room: "Sala Soles",
  eyebrow: "GUARDERÍA · SALA SOLES",
  salutation: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
};

export const posts: Post[] = [
  {
    id: "post-achievement",
    kind: "achievement",
    target: { type: "kid", kidName: "Mateo" },
    time: "14:20",
    author: "publicado por vos",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-activity",
    kind: "activity",
    target: { type: "kid", kidName: "Mateo" },
    time: "09:40",
    author: "publicado por vos",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    photoCaption: "Foto · pintando con témperas",
  },
  {
    id: "post-announcement",
    kind: "announcement",
    target: { type: "room" },
    time: "07:50",
    author: "publicado por vos",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];

export function formatKidNameList(names: string[]): string {
  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (names.length === 2) {
    return `${names[0]} y ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

export function formatPostAudience(target: PostTarget): string {
  if (target.type === "room") {
    return "Para: toda la sala";
  }

  if (target.type === "kid") {
    return `Para: familia de ${target.kidName}`;
  }

  return `Para: familias de ${formatKidNameList(target.kidNames)}`;
}

export function formatPostTime(createdAt: string): string {
  const date = new Date(createdAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function createdPostToPost(post: CreatedPost): Post {
  return {
    id: post.id,
    kind: post.kind,
    target: toPostTarget(post.target),
    time: formatPostTime(post.createdAt),
    author: "publicado por vos",
    body: post.body,
    likes: 0,
    comments: 0,
  };
}

export function isCreatedPost(value: unknown): value is CreatedPost {
  if (typeof value !== "object" || value === null) return false;

  const post = value as Record<string, unknown>;

  if (!isNonEmptyString(post.id) || !isNonEmptyString(post.body)) return false;
  if (!isPostKind(post.kind)) return false;
  if (
    !isNonEmptyString(post.createdAt) ||
    Number.isNaN(Date.parse(post.createdAt))
  ) {
    return false;
  }

  const target = post.target;
  if (typeof target !== "object" || target === null) return false;

  const { type } = target as Record<string, unknown>;

  if (type === "room") return true;
  if (type === "kid") {
    return isCreatedPostKid(target);
  }
  if (type !== "kids") return false;

  const kids = (target as Record<string, unknown>).kids;

  return Array.isArray(kids) && kids.length > 0 && kids.every(isCreatedPostKid);
}

function isCreatedPostKid(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  const kid = value as Record<string, unknown>;

  return isNonEmptyString(kid.kidId) && isNonEmptyString(kid.kidName);
}

function toPostTarget(target: CreatedPostTarget): PostTarget {
  if (target.type === "room") {
    return { type: "room" };
  }

  if (target.type === "kid") {
    return { type: "kid", kidName: target.kidName };
  }

  if (target.kids.length === 1) {
    return { type: "kid", kidName: target.kids[0].kidName };
  }

  return { type: "kids", kidNames: target.kids.map((kid) => kid.kidName) };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function isPostKind(value: unknown): value is PostKind {
  return typeof value === "string" && postKinds.includes(value as PostKind);
}
