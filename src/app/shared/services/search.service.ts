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

  async findByMonth(
    date: Date,
    query: string,
    isTagSearch: boolean
  ): Promise<void> {
    let entries = this.entriesService.getEntriesByDate(date);

    if (!entries) {
      const response: BackendResponse = await this.entriesService.fetchUserEntriesByMonth(
        date
      );

      if (response.error) {
        console.error(response.message);
        return;
      }

      entries = response.data.entries;
    }
    if (isTagSearch) this.entries = this.filterEntriesByTag(entries, query);
    else this.entries = this.filterEntriesByQuery(entries, query);
  }

  async findByYear(
    date: Date,
    query: string,
    isTagSearch: boolean
  ): Promise<void> {
    const entries = await this.entriesService.fetchUserEntriesByYear(date);

    if (entries === null) return;

    if (isTagSearch) this.entries = this.filterEntriesByTag(entries, query);
    else this.entries = this.filterEntriesByQuery(entries, query);

    this.entries = this.entries.sort(
      (a, b) => b.time.getTime() - a.time.getTime()
    );
  }

  filterEntriesByQuery(entries: Entry[], text: string): Entry[] {
    if (!entries) return [];
    return entries.filter(
      (entry: Entry) =>
        entry.text.toLowerCase().includes(text.toLowerCase()) ||
        entry.title.toLowerCase().includes(text.toLowerCase())
    );
  }

  filterEntriesByTag(entries: Entry[], tag: string): Entry[] {
    if (!entries) return [];
    return entries.filter((entry: Entry) => {
      if (!entry.tags) return false;
      return entry.tags.includes(tag)
    });
  }
}
