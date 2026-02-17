import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label ? <span className="text-slate-600">{label}</span> : null}
      <input
        {...props}
        className={clsx(
          "rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
          className
        )}
      />
    </label>
  );
}
