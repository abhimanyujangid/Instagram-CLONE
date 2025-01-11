export function debounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  delay: number
): (...args: Parameters<Fn>) => void {
  let timer: number | undefined;
  return (...args: Parameters<Fn>) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
