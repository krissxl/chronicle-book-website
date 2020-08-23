import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Entry, BackendResponse } from '../interfaces';
import { getUserEntries } from '../api/firebase';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  entries: { [key: string]: Entry[] } = {};

  constructor(private authService: AuthService) {}

  // Fetch entries from server if necessary
  async fetchUserEntriesByDate(date: Date): Promise<BackendResponse> {
    const dateName = this.getDateName(date);
    if (this.entries[dateName]) return;

    const monthBorders = this.getMonthBorders(
      date.getFullYear(),
      date.getMonth()
    );
    const response: BackendResponse = await getUserEntries(
      this.authService.user.id,
      monthBorders.start,
      monthBorders.end
    );

    if (!response.error) {
      this.entries[dateName] = response.data.entries;

      return {
        error: false,
        message:
          'Entries successfully fetched for ' + date.getMonth() + ' month',
      };
    } else {
      return { error: true, message: response.message };
    }
  }

  getMonthBorders(year: number, month: number): { start: Date; end: Date } {
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month + 1, 0, 23, 59, 59, 999),
    };
  }

  // Get already fetched entries by date
  getEntriesByDate(date: Date): Entry[] {
    const dateName = this.getDateName(date);
    return this.entries[dateName];
  }

  private getDateName(date: Date): string {
    return date.getFullYear().toString() + '-' + date.getMonth().toString();
  }

  getById(id: string): Entry | undefined {
    if (!this.entries) return undefined;

    for (const key in this.entries) {
      const monthEntries: Entry[] = this.entries[key];

      const entry = monthEntries.find((entry) => entry.id === id);
      if (entry) return entry;
    }
    return undefined;
  }

  updateEntry(newEntry: Entry): void {
    const dateName: string = this.getDateName(newEntry.time);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      const index: number = entries.findIndex(entry => entry.id === newEntry.id);
      this.entries[dateName][index] = newEntry;
    }
  }

  addEntry(entry: Entry): void {
    const dateName: string = this.getDateName(entry.time);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      this.entries[dateName].unshift(entry);
      this.entries[dateName].sort((a,b) => b.time.getTime() - a.time.getTime())
    }
  }

  deleteEntry(date: Date, id: string): void {
    const dateName: string = this.getDateName(date);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      this.entries[dateName] = entries.filter(e => e.id !== id);
    }
  }

  getOccupiedDays(date: Date): number[] {
    const dateName = this.getDateName(date);
    const entries: Entry[] = this.entries[dateName];

    const mappedDays: number[] = entries.map((entry) => entry.time.getDate());
    // Set needs to remove duplicates
    const daysSet: Set<number> = new Set(mappedDays);
    const days: number[] = [...daysSet];
    return days;
  }
}
