// 日付は `YYYY-MM-DD` (ローカルタイム基準の ISO) を正準形式として扱う。
// これは <input type="date"> の value 形式と一致する。

export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayISO = (): string => toISODate(new Date());

export const fromISODate = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const addDaysISO = (iso: string, days: number): string => {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const createDateList = (startISO: string, endISO: string): string[] => {
  const list: string[] = [];
  const end = fromISODate(endISO);
  for (let d = fromISODate(startISO); d <= end; d.setDate(d.getDate() + 1)) {
    list.push(toISODate(d));
  }
  return list;
};

export const weekdayIndex = (iso: string): number => fromISODate(iso).getDay();

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

// 旧版はロケール依存の toLocaleDateString()（例 "2026/7/6"）を保存していた。
// ISO へ正規化する（変換できない値はそのまま返す）。
export const normalizeDateString = (s: string): string => {
  if (ISO_RE.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return toISODate(d);
};

export const isISODate = (s: string): boolean => ISO_RE.test(s);
