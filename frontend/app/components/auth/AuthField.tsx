import React from "react";

type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

// Labelled text input used by every auth form. All input props pass through.
export default function AuthField({
  label,
  id,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="xp-field">
      <label htmlFor={id} className="xp-label">
        {label}
      </label>

      <input
        id={id}
        {...inputProps}
        className="xp-input w-full rounded-xp-sm border border-xp-input-border p-1.5 outline-none"
      />
    </div>
  );
}
