export function hasTimeConflict(
  timeA: string,
  timeB: string
) {
  const [aStart, aEnd] = timeA.split(" - ");
  const [bStart, bEnd] = timeB.split(" - ");

  return !(
    aEnd <= bStart || bEnd <= aStart
  );
}
