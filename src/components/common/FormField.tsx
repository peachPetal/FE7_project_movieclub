import type { FC } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  as?: "input" | "textarea";
} & (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export const FormField: FC<FormFieldProps> = ({ id, label, as = 'input', ...props }) => {
  const commonClasses = "w-full rounded-md border border-[var(--color-text-placeholder)] bg-[var(--color-background-main)] p-3 text-[var(--color-text-main)] dark:border-[var(--color-text-light)]";
  
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[var(--color-text-sub)]" htmlFor={id}>{label}</label>
      {as === 'textarea' ? (
        <textarea id={id} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} className={`${commonClasses} min-h-[180px]`} />
      ) : (
        <input id={id} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} className={commonClasses} />
      )}
    </div>
  );
};