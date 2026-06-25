/**
 * Sistema de botones institucional UAO (CSS Modules).
 *
 * - `UaoButton`     → <button> con variantes, tamaños, iconos y estado de carga.
 * - `UaoButtonLink` → <a> con el mismo lenguaje visual, para acciones que navegan.
 * - `UaoIconButton` → botón solo-icono con `aria-label` obligatorio.
 *
 * Propaga `...props` (incluye `data-*`, `aria-*`, `onClick`, `disabled`), por lo
 * que conserva contratos existentes como `data-guide-id` (guía de Laia).
 */
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./UaoButton.module.css";

export type UaoButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "inverse"
  | "danger";
export type UaoButtonSize = "sm" | "md" | "lg";

type SharedVisualProps = {
  variant?: UaoButtonVariant;
  size?: UaoButtonSize;
  /** Bordes totalmente redondeados (estilo "píldora"). */
  pill?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
};

function classList(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function visualClasses(
  variant: UaoButtonVariant,
  size: UaoButtonSize,
  pill: boolean,
  className?: string,
): string {
  return classList(
    styles.root,
    styles[variant],
    styles[size],
    pill && styles.pill,
    className,
  );
}

function Content({
  leadingIcon,
  trailingIcon,
  children,
}: {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      {leadingIcon ? (
        <span className={styles.icon} aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {trailingIcon ? (
        <span className={styles.icon} aria-hidden="true">
          {trailingIcon}
        </span>
      ) : null}
    </>
  );
}

// ── UaoButton ───────────────────────────────────────────────────────────────
export interface UaoButtonProps
  extends SharedVisualProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const UaoButton = forwardRef<HTMLButtonElement, UaoButtonProps>(
  function UaoButton(
    {
      variant = "primary",
      size = "md",
      pill = false,
      leadingIcon,
      trailingIcon,
      isLoading = false,
      disabled,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={visualClasses(variant, size, pill, className)}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.srOnly}>Cargando</span>
          </>
        ) : (
          <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
            {children}
          </Content>
        )}
      </button>
    );
  },
);

// ── UaoButtonLink ─────────────────────────────────────────────────────────────
export interface UaoButtonLinkProps
  extends SharedVisualProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {}

export const UaoButtonLink = forwardRef<HTMLAnchorElement, UaoButtonLinkProps>(
  function UaoButtonLink(
    {
      variant = "primary",
      size = "md",
      pill = false,
      leadingIcon,
      trailingIcon,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <a
        ref={ref}
        className={visualClasses(variant, size, pill, className)}
        {...props}
      >
        <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
          {children}
        </Content>
      </a>
    );
  },
);

// ── UaoIconButton ─────────────────────────────────────────────────────────────
export interface UaoIconButtonProps
  extends Omit<SharedVisualProps, "leadingIcon" | "trailingIcon">,
    ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nombre accesible obligatorio (botón sin texto visible). */
  "aria-label": string;
  icon: ReactNode;
  /** Forma circular (cierres de modal, controles flotantes). */
  round?: boolean;
}

export const UaoIconButton = forwardRef<HTMLButtonElement, UaoIconButtonProps>(
  function UaoIconButton(
    {
      variant = "secondary",
      size = "md",
      round = false,
      icon,
      className,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={classList(
          styles.root,
          styles[variant],
          styles[size],
          styles.iconOnly,
          round && styles.round,
          className,
        )}
        {...props}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      </button>
    );
  },
);
