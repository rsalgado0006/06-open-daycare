export type RoomId = "soles" | "lunas" | "estrellas";

export type Room = {
  id: RoomId;
  name: string;
  short: string;
  sectionLabel: string;
};

export const rooms: Room[] = [
  { id: "soles", name: "Sala Soles", short: "Soles", sectionLabel: "SALA SOLES" },
  { id: "lunas", name: "Sala Lunas", short: "Lunas", sectionLabel: "SALA LUNAS" },
  {
    id: "estrellas",
    name: "Sala Estrellas",
    short: "Estrellas",
    sectionLabel: "SALA ESTRELLAS",
  },
];

export const room = rooms[0];

export type KidTone = "sky" | "rose" | "mint" | "sun" | "violet";

export type ParentStatus = "active" | "pending";

export type ParentRelation = "Mamá" | "Papá" | "Tutor/a";

export type LinkedParent = {
  id: string;
  name: string;
  initial: string;
  relation: ParentRelation;
  status: ParentStatus;
};

export type Kid = {
  id: string;
  name: string;
  initial: string;
  age: number;
  tone: KidTone;
  roomId: RoomId;
  birthDate: string;
  admission: string;
  alert?: { cardLabel: string; body: string };
  parents: LinkedParent[];
};

export type ParentInvite = {
  id: string;
  kidId: string;
  name: string;
  email: string;
  relation: ParentRelation;
  createdAt: string;
};

export const kids: Kid[] = [
  {
    id: "mateo-fernandez",
    name: "Mateo Fernández",
    roomId: "soles",
    initial: "M",
    age: 3,
    tone: "sky",
    birthDate: "12 mar 2022",
    admission: "feb 2025",
    alert: {
      cardLabel: "MANÍ",
      body: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
    parents: [
      {
        id: "lucia-fernandez",
        name: "Lucía Fernández",
        initial: "L",
        relation: "Mamá",
        status: "active",
      },
      {
        id: "diego-fernandez",
        name: "Diego Fernández",
        initial: "D",
        relation: "Papá",
        status: "pending",
      },
    ],
  },
  {
    id: "sofia-mendez",
    name: "Sofía Méndez",
    roomId: "soles",
    initial: "S",
    age: 2,
    tone: "rose",
    birthDate: "8 sep 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "carolina-mendez",
        name: "Carolina Méndez",
        initial: "C",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
  {
    id: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    roomId: "soles",
    initial: "B",
    age: 3,
    tone: "mint",
    birthDate: "21 ene 2022",
    admission: "feb 2024",
    parents: [
      {
        id: "paula-ruiz",
        name: "Paula Ruiz",
        initial: "P",
        relation: "Mamá",
        status: "active",
      },
      {
        id: "andres-ruiz",
        name: "Andrés Ruiz",
        initial: "A",
        relation: "Papá",
        status: "active",
      },
    ],
  },
  {
    id: "valentina-soto",
    name: "Valentina Soto",
    roomId: "soles",
    initial: "V",
    age: 2,
    tone: "sun",
    birthDate: "3 may 2023",
    admission: "mar 2025",
    parents: [],
  },
  {
    id: "tomas-diaz",
    name: "Tomás Díaz",
    roomId: "soles",
    initial: "T",
    age: 3,
    tone: "violet",
    birthDate: "17 nov 2022",
    admission: "feb 2024",
    alert: {
      cardLabel: "LACTOSA",
      body: "Intolerancia a la lactosa. Ofrecerle leche sin lactosa y evitar yogures comunes.",
    },
    parents: [
      {
        id: "mariano-diaz",
        name: "Mariano Díaz",
        initial: "M",
        relation: "Papá",
        status: "active",
      },
    ],
  },
  {
    id: "emma-castro",
    name: "Emma Castro",
    roomId: "soles",
    initial: "E",
    age: 2,
    tone: "rose",
    birthDate: "30 jun 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "julieta-castro",
        name: "Julieta Castro",
        initial: "J",
        relation: "Mamá",
        status: "pending",
      },
    ],
  },
  {
    id: "lucas-romero",
    name: "Lucas Romero",
    roomId: "soles",
    initial: "L",
    age: 3,
    tone: "sky",
    birthDate: "4 feb 2022",
    admission: "ene 2024",
    parents: [
      {
        id: "romina-romero",
        name: "Romina Romero",
        initial: "R",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
  {
    id: "olivia-vega",
    name: "Olivia Vega",
    roomId: "soles",
    initial: "O",
    age: 2,
    tone: "mint",
    birthDate: "19 ago 2023",
    admission: "feb 2025",
    parents: [
      {
        id: "florencia-vega",
        name: "Florencia Vega",
        initial: "F",
        relation: "Mamá",
        status: "active",
      },
    ],
  },
];

export function getKid(id: string): Kid | undefined {
  return kids.find((kid) => kid.id === id);
}

export const parentInvitesStorageKey = "opendaycare:parent-invites:v1";

const parentRelations: ParentRelation[] = ["Mamá", "Papá", "Tutor/a"];

const inviteCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const inviteCodeLength = 5;

export function generateInviteCode(): string {
  const randomValues = new Uint32Array(inviteCodeLength);

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(randomValues);
  } else {
    for (let index = 0; index < randomValues.length; index += 1) {
      randomValues[index] = Math.floor(Math.random() * 4294967296);
    }
  }

  return Array.from(
    randomValues,
    (value) => inviteCodeAlphabet[value % inviteCodeAlphabet.length],
  ).join("");
}

export function inviteToLinkedParent(invite: ParentInvite): LinkedParent {
  const name = invite.name.trim();

  return {
    id: invite.id,
    name,
    initial: name.charAt(0).toLocaleUpperCase("es-AR"),
    relation: invite.relation,
    status: "pending",
  };
}

export function isParentInvite(value: unknown): value is ParentInvite {
  if (!value || typeof value !== "object") {
    return false;
  }

  const invite = value as Record<string, unknown>;

  return (
    typeof invite.id === "string" &&
    invite.id.length > 0 &&
    typeof invite.kidId === "string" &&
    invite.kidId.length > 0 &&
    typeof invite.name === "string" &&
    invite.name.trim().length > 0 &&
    typeof invite.email === "string" &&
    invite.email.trim().length > 0 &&
    typeof invite.relation === "string" &&
    parentRelations.includes(invite.relation as ParentRelation) &&
    typeof invite.createdAt === "string" &&
    !Number.isNaN(new Date(invite.createdAt).getTime())
  );
}

export type CreatedKid = {
  id: string;
  name: string;
  birthDate: string;
  roomId: RoomId;
  allergies: string[];
  medicalNotes: string;
  createdAt: string;
};

export const kidsStorageKey = "opendaycare:kids:v1";

const kidTones: KidTone[] = ["sky", "rose", "mint", "sun", "violet"];

const monthAbbreviations = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const roomIds = new Set<RoomId>(rooms.map((item) => item.id));

function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function parseAllergyTags(value: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const part of value.split(",")) {
    const tag = part.trim();

    if (!tag) {
      continue;
    }

    const key = tag.toLocaleLowerCase("es-AR");

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    tags.push(tag);
  }

  return tags;
}

export function buildKidId(name: string, existingIds: string[]): string {
  const base =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "nino";

  let candidate = base;
  let suffix = 2;

  while (existingIds.includes(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export function calculateAge(birthDate: string): number {
  const date = parseIsoDate(birthDate);

  if (!date) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

export function formatBirthDate(birthDate: string): string {
  const date = parseIsoDate(birthDate);

  if (!date) {
    return "";
  }

  return `${date.getDate()} ${monthAbbreviations[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatAdmission(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${monthAbbreviations[date.getMonth()]} ${date.getFullYear()}`;
}

export function createdKidToKid(kid: CreatedKid, position: number): Kid {
  const name = kid.name.trim();
  const firstAllergy = kid.allergies[0];

  return {
    id: kid.id,
    name,
    initial: name.charAt(0).toLocaleUpperCase("es-AR"),
    age: calculateAge(kid.birthDate),
    tone: kidTones[position % kidTones.length],
    roomId: kid.roomId,
    birthDate: formatBirthDate(kid.birthDate),
    admission: formatAdmission(kid.createdAt),
    alert: firstAllergy
      ? {
          cardLabel: firstAllergy.toLocaleUpperCase("es-AR"),
          body: kid.medicalNotes,
        }
      : undefined,
    parents: [],
  };
}

export function isCreatedKid(value: unknown): value is CreatedKid {
  if (!value || typeof value !== "object") {
    return false;
  }

  const kid = value as Record<string, unknown>;

  return (
    typeof kid.id === "string" &&
    kid.id.length > 0 &&
    typeof kid.name === "string" &&
    kid.name.trim().length > 0 &&
    typeof kid.birthDate === "string" &&
    parseIsoDate(kid.birthDate) !== null &&
    typeof kid.roomId === "string" &&
    roomIds.has(kid.roomId as RoomId) &&
    Array.isArray(kid.allergies) &&
    kid.allergies.every(
      (allergy) => typeof allergy === "string" && allergy.trim().length > 0,
    ) &&
    typeof kid.medicalNotes === "string" &&
    typeof kid.createdAt === "string" &&
    !Number.isNaN(new Date(kid.createdAt).getTime())
  );
}
