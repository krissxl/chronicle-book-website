import { Injectable } from '@angular/core';
import { Entry, BackendResponse } from '../interfaces';
import { addNewEntry, updateEntry, deleteEntry, getEntryById } from '../api/firebase';
import { AuthService } from '../auth.service';
import { EntriesService } from './entries.service';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  entryText: string;
  entryId: string;
  entryTitle: string;
  entryCreated: Date;
  entryUpdated: Date;

  constructor(private authService: AuthService, private entriesService: EntriesService) {}

  setEntry(entry: Entry) {
    this.entryId = entry?.id;
    this.entryText = entry.text;
    this.entryTitle = entry?.title;
    this.entryCreated = entry.created_at;
    this.entryUpdated = entry?.updated_at;
  }

  reset() {
    this.entryId = undefined;
    this.entryText = undefined;
    this.entryTitle = undefined;
    this.entryCreated = undefined;
    this.entryUpdated = undefined;
  }

  async createNewEntry() {
    const entry: Entry = {
      created_at: this.entryCreated,
      text: this.entryText,
    };

    const response: BackendResponse = await addNewEntry(
      this.authService.user.id,
      entry
    );

    return response;
  }

  async fetchEntry(id: string): Promise<BackendResponse> {
    if (this.entryId !== id) {
      this.reset();
      const findedEntry = this.entriesService.getById(id);
      if (!findedEntry) {
        const response: BackendResponse = await getEntryById(this.authService.user.id, id); 
        if (response.error) {
          return {error: true, message: response.message}
        }
        this.setEntry(response.data.entry);
      } else {
        this.setEntry(findedEntry);
      }
    }

    return {error: false, message: 'Entry with ID '}
  }

  async updateEntry() {
    const updating = { text: this.entryText, title: this.entryTitle };
    const response: BackendResponse = await updateEntry(this.entryId, updating);
    return response;
  }

  async deleteEntry() {
    const response: BackendResponse = await deleteEntry(this.entryId);

    return response;
  }
}
