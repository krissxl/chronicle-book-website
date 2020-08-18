import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Entry, BackendResponse } from '../interfaces';
import { getUserEntries } from '../api/firebase';

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  entries: Entry[];

  constructor(private authService: AuthService) {}

  async fetchUserEntriesByDate(date: Date): Promise<BackendResponse> {
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
      this.entries = response.data.entries;

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

  getById(id: string): Entry | undefined {
    if (this.entries) {
      const entry = this.entries.find((entry) => entry.id === id);
      return entry;
    } else {
      return undefined;
    }
  }
}
