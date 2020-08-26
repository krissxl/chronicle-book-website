import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Entry, BackendResponse } from '../interfaces';
import { getUserEntries } from '../api/firebase';
import { getMonthBorders, getDateName } from '../scripts/date';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  entries: { [key: string]: Entry[] } = {};

  constructor(private authService: AuthService) {}

  // Fetch entries from server if necessary
  async fetchUserEntriesByMonth(date: Date): Promise<BackendResponse> {
    const dateName = getDateName(date);
    if (this.entries[dateName])
      return {
        error: false,
        message: 'Entries already fetched',
        data: { entries: this.entries[dateName] },
      };

    const monthBorders = getMonthBorders(date);
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
        data: response.data,
      };
    } else {
      return { error: true, message: response.message };
    }
  }

  async fetchUserEntriesByYear(date: Date): Promise<Entry[]> | null {
    // Check if entries already fetched
    let entries: Entry[] = [];
    for (let i = 0; i < 12; i++) {
      const foundEntries = this.getEntriesByDate(new Date(date.getFullYear(), i));
      if (foundEntries === undefined) break;
      else entries = entries.concat(foundEntries);

      if (i === 11) return entries
    }

    const response: BackendResponse = await getUserEntries(
      this.authService.user.id,
      new Date(date.getFullYear(), 0, 1),
      new Date(date.getFullYear(), 11, 0, 23, 59, 59, 999)
    );

    if (response.error) return null;
    entries = response.data.entries
    // Add entries to Entries Service
    for (let i = 0; i < 12; i++) {
      const loopDate = new Date(date.getFullYear(), i);
      const dateName = getDateName(loopDate);
      const borders = getMonthBorders(loopDate);

      this.entries[dateName] = entries.filter(
        (entry: Entry) =>
          entry.time >= borders.start && entry.time <= borders.end
      );
    }

    return entries;
  }

  // Get already fetched entries by date
  getEntriesByDate(date: Date): Entry[] {
    const dateName = getDateName(date);
    return this.entries[dateName];
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
    const dateName: string = getDateName(newEntry.time);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      const index: number = entries.findIndex(
        (entry) => entry.id === newEntry.id
      );
      this.entries[dateName][index] = newEntry;
    }
  }

  addEntry(entry: Entry): void {
    const dateName: string = getDateName(entry.time);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      this.authService.addEntriesCount(entry.time)
      this.entries[dateName].unshift(entry);
      this.entries[dateName].sort(
        (a, b) => b.time.getTime() - a.time.getTime()
      );
    }
  }

  deleteEntry(entryTime: Date, id: string): void {
    const dateName: string = getDateName(entryTime);
    const entries: Entry[] = this.entries[dateName];
    if (entries) {
      this.authService.subEntriesCount(entryTime);
      this.entries[dateName] = entries.filter((e) => e.id !== id);
    }
  }

  getOccupiedDays(date: Date): number[] {
    const dateName = getDateName(date);
    const entries: Entry[] = this.entries[dateName];

    const mappedDays: number[] = entries.map((entry) => entry.time.getDate());
    // Set needs to remove duplicates
    const daysSet: Set<number> = new Set(mappedDays);
    const days: number[] = [...daysSet];
    return days;
  }
}
