import type { ReactNode } from "react";
import { clsx } from "clsx";

type Option = { value: string; label: string };

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  className?: string;
};

function Label({
  id,
  label,
  required,
  optionalLabel,
}: Pick<BaseProps, "id" | "label" | "required" | "optionalLabel">) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {required ? (
        <span className="text-brand-red"> *</span>
      ) : optionalLabel ? (
        <span className="font-normal text-brand-mute"> {optionalLabel}</span>
      ) : null}
    </label>
  );
}

export function FieldShell({
  id,
  label,
  error,
  required,
  optionalLabel,
  className,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <Label id={id} label={label} required={required} optionalLabel={optionalLabel} />
      {children}
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { registration?: object };

export function TextField({
  id,
  label,
  error,
  required,
  optionalLabel,
  className,
  registration,
  ...rest
}: InputProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      className={className}
    >
      <input
        id={id}
        className={clsx("field-input", error && "border-brand-red focus:ring-brand-red/40")}
        aria-invalid={Boolean(error)}
        {...registration}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = BaseProps & {
  options: Option[];
  placeholder?: string;
  registration?: object;
};

export function SelectField({
  id,
  label,
  error,
  required,
  optionalLabel,
  className,
  options,
  placeholder,
  registration,
}: SelectProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      className={className}
    >
      <select
        id={id}
        className={clsx(
          "field-input appearance-none bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-10",
          error && "border-brand-red focus:ring-brand-red/40",
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='m6 9 6 6 6-6' stroke='%236B7280' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        }}
        aria-invalid={Boolean(error)}
        {...registration}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type TextAreaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { registration?: object };

export function TextAreaField({
  id,
  label,
  error,
  required,
  optionalLabel,
  className,
  registration,
  ...rest
}: TextAreaProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      required={required}
      optionalLabel={optionalLabel}
      className={className}
    >
      <textarea
        id={id}
        rows={4}
        className={clsx(
          "field-input resize-y",
          error && "border-brand-red focus:ring-brand-red/40",
        )}
        aria-invalid={Boolean(error)}
        {...registration}
        {...rest}
      />
    </FieldShell>
  );
}
