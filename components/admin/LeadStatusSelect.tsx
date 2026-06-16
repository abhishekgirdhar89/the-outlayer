"use client";

export function LeadStatusSelect({
  id,
  current,
  options,
  action,
}: {
  id: string;
  current: string;
  options: string[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const opts = options.includes(current) ? options : [current, ...options];
  return (
    <form action={action} style={{ display: "inline-block" }}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={current}
        className="status-select"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {opts.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
