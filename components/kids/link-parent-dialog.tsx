"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { CloseIcon, InfoIcon, SendIcon } from "@/components/shared/icons";
import {
  generateInviteCode,
  type ParentInvite,
  type ParentRelation,
} from "@/data/kids";

type LinkParentDialogProps = {
  open: boolean;
  kidId: string;
  kidName: string;
  existingEmails: string[];
  onClose: () => void;
  onInvite: (invite: ParentInvite) => void;
};

type FormErrors = {
  name?: string;
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const relationOptions: ParentRelation[] = ["Mamá", "Papá", "Tutor/a"];

const defaultRelation: ParentRelation = "Mamá";

function fieldClassName(hasError: boolean) {
  return [
    "w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-heading outline-none placeholder:text-placeholder",
    hasError ? "border-coral-strong" : "border-field-border",
  ].join(" ");
}

export function LinkParentDialog({
  open,
  kidId,
  kidName,
  existingEmails,
  onClose,
  onInvite,
}: LinkParentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState<ParentRelation>(defaultRelation);
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const relationLabelId = `${formId}-relation`;
  const titleId = `${formId}-title`;
  const kidFirstName = kidName.trim().split(/\s+/)[0] ?? kidName;

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Código aleatorio generado al abrir, nunca en el render, para que el
    // HTML del servidor y el del cliente coincidan en la hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInviteCode(generateInviteCode());
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

  function clearError(field: keyof FormErrors) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    const trimmedEmail = email.trim();

    if (!name.trim()) {
      next.name = "Ingresá el nombre.";
    }

    if (!trimmedEmail) {
      next.email = "Ingresá el email.";
    } else if (!emailPattern.test(trimmedEmail)) {
      next.email = "Ingresá un email válido.";
    } else {
      const normalizedEmail = trimmedEmail.toLowerCase();
      const alreadyInvited = existingEmails.some(
        (value) => value.trim().toLowerCase() === normalizedEmail,
      );

      if (alreadyInvited) {
        next.email = "Ya vinculaste a este email.";
      }
    }

    return next;
  }

  function resetForm() {
    setName("");
    setEmail("");
    setRelation(defaultRelation);
    setInviteCode("");
    setErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.name) {
      nameRef.current?.focus();
      return;
    }

    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }

    const trimmedEmail = email.trim();

    onInvite({
      id: `${kidId}:${trimmedEmail.toLowerCase()}`,
      kidId,
      name: name.trim(),
      email: trimmedEmail,
      relation,
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
      className="m-auto w-[min(480px,calc(100vw-48px))] max-h-[calc(100vh-64px)] overflow-hidden rounded-[24px] border border-edge bg-auth-bg p-0 text-heading shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)] backdrop:bg-[rgba(63,54,46,.45)]"
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-64px)] flex-col"
      >
        <div className="flex flex-none items-center justify-between border-b border-edge px-[26px] py-5">
          <div>
            <h2
              id={titleId}
              className="m-0 font-heading text-[18px] font-semibold text-heading"
            >
              Vincular padre
            </h2>
            <div className="text-[13px] text-meta">a {kidName}</div>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => dialogRef.current?.close()}
            className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[10px] bg-action-line text-secondary"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-[26px] py-[22px]">
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-info-panel px-4 py-[13px]">
            <span className="mt-px flex-none">
              <InfoIcon />
            </span>
            <span className="text-[13.5px] leading-[1.45] text-info-copy">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {kidFirstName}.
            </span>
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor={nameId}
              className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
            >
              NOMBRE DEL PADRE/MADRE
            </label>
            <input
              id={nameId}
              ref={nameRef}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              placeholder="Ej. Diego Fernández"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              className={fieldClassName(Boolean(errors.name))}
            />
            {errors.name ? (
              <p
                id={`${nameId}-error`}
                role="alert"
                className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor={emailId}
              className="mb-2 block text-[12px] font-extrabold tracking-[.7px] text-secondary"
            >
              EMAIL
            </label>
            <input
              id={emailId}
              ref={emailRef}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearError("email");
              }}
              placeholder="correo@ejemplo.com"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              className={fieldClassName(Boolean(errors.email))}
            />
            {errors.email ? (
              <p
                id={`${emailId}-error`}
                role="alert"
                className="mt-[6px] mb-0 text-[12.5px] font-bold text-coral-strong"
              >
                {errors.email}
              </p>
            ) : null}
          </div>

          <div
            id={relationLabelId}
            className="mb-[10px] text-[12px] font-extrabold tracking-[.7px] text-secondary"
          >
            PARENTESCO
          </div>
          <div
            role="radiogroup"
            aria-labelledby={relationLabelId}
            className="mb-5 flex gap-[9px]"
          >
            {relationOptions.map((option) => {
              const isSelected = option === relation;

              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setRelation(option)}
                  className={`flex-1 cursor-pointer rounded-full border-[1.5px] p-[11px] text-[14px] font-extrabold ${
                    isSelected
                      ? "border-relation-line bg-badge-announcement text-badge-announcement-ink"
                      : "border-edge bg-card text-nav"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-consent-line bg-consent-bg p-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-consent-label">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-heading text-[34px] font-semibold tracking-[7px] text-consent-ink">
              {inviteCode}
            </div>
            <div className="mt-[6px] text-[13px] text-consent-label">
              Vence en 7 días
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            <SendIcon />
            Enviar invitación
          </button>
        </div>
      </form>
    </dialog>
  );
}
