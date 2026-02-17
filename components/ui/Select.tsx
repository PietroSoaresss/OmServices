import clsx from "clsx";

type SelectOption = { label: string; value: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
};

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label ? <span className="text-slate-600">{label}</span> : null}
      <select
        {...props}
        className={clsx(
          "rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
          className
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
