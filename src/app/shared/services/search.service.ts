import { Injectable } from '@angular/core';
import { Entry, BackendResponse } from '../interfaces';
import { getMonthBorders } from '../scripts/date';
import { EntriesService } from './entries.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  entries: Entry[];

  constructor(private entriesService: EntriesService) {}

  async findByMonth(date: Date, text: string): Promise<void> {
    let entries = this.entriesService.getEntriesByDate(date);

    if (entries) {
      entries = entries.filter(
        (entry: Entry) =>
          entry.text.toLowerCase().includes(text) ||
          entry.title.toLowerCase().includes(text)
      );
      this.entries = entries;
    } else {
      const response: BackendResponse = await this.entriesService.fetchUserEntriesByMonth(
        date
      );

      if (!response.error) {
        entries = response.data.entries.filter(
          (entry: Entry) =>
            entry.text.toLowerCase().includes(text) ||
            entry.title.toLowerCase().includes(text)
        );
        this.entries = entries;
      }
    }
  }

  async findByYear(date: Date, text: string): Promise<void> {
    const entries = await this.entriesService.fetchUserEntriesByYear(date);
    this.entries = entries.filter(
      (entry: Entry) =>
        entry.text.toLowerCase().includes(text) ||
        entry.title.toLowerCase().includes(text)
    );
    this.entries.sort((a, b) => b.time.getTime() - a.time.getTime());
  }
}
