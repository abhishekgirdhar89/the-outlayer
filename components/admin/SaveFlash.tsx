/**
 * Success banner shown after a save/delete redirect (?saved=1 / ?deleted=1).
 * Failures are surfaced separately by app/admin/error.tsx.
 */
export function SaveFlash({ saved, deleted }: { saved?: string; deleted?: string }) {
  if (!saved && !deleted) return null;
  return (
    <div className="flash" role="status">
      {deleted ? "Removed — your changes are live." : "Saved — your changes are live."}
    </div>
  );
}
