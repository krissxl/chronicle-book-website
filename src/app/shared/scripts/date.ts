export function getMonthBorders(date: Date = new Date()): { start: Date; end: Date } {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

export function getDateName(date: Date = new Date()): string {
    return date.getFullYear().toString() + '-' + date.getMonth().toString();
  }