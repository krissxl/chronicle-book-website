import { Injectable } from '@angular/core';
import { Entry, BackendResponse } from '../interfaces';
import {
  addNewEntry,
  updateEntry,
  deleteEntry,
  getEntryById,
} from '../api/firebase';
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
  entryTime: Date;
  entryTags: string[] = [];

  constructor(
    private authService: AuthService,
    private entriesService: EntriesService
  ) {}

  setEntry(entry: Entry) {
    this.entryId = entry.id;
    this.entryText = entry.text;
    this.entryTitle = entry?.title;
    this.entryCreated = entry.created_at;
    this.entryUpdated = entry?.updated_at;
    this.entryTime = entry.time;
    this.entryTags = entry?.tags;
  }

  reset() {
    this.entryId = undefined;
    this.entryText = undefined;
    this.entryTitle = undefined;
    this.entryCreated = undefined;
    this.entryUpdated = undefined;
    this.entryTime = undefined;
    this.entryTags = [];
  }

  setNewDate(date: Date): void {
    if (this.entryTime) {
      date.setHours(this.entryTime.getHours());
      date.setMinutes(this.entryTime.getMinutes());
      date.setSeconds(this.entryTime.getSeconds());
      date.setMilliseconds(this.entryTime.getMilliseconds());
    }
    this.entryTime = date;
  }

  setNewTime(time: { hours: number; minutes: number }) {
    const newTime = new Date(this.entryTime);
    const hours = time.hours >= 0 && time.hours < 24 ? time.hours : 0;
    const minutes = time.minutes >= 0 && time.minutes < 60 ? time.minutes : 0;

    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    this.entryTime = newTime;
  }

  async createNewEntry() {
    const entry: Entry = {
      created_at: new Date(),
      text: this.entryText,
      time: this.entryTime,
      title: this.entryTitle,
      tags: this.entryTags,
    };

    try {
      const response: BackendResponse = await addNewEntry(
        this.authService.user.id,
        entry
      );
      return response;
    } catch (error) {
      return {error: true, message: error.message}
    }
  }

  async fetchEntry(id: string): Promise<BackendResponse> {
    if (this.entryId === id)
      return { error: false, message: 'Entry with ID ' + id + ' already set' };

    this.reset();
    // Trying to find in entries service
    const foundEntry = this.entriesService.getById(id);
    if (foundEntry) {
      this.setEntry(foundEntry);
      return { error: false, message: 'Entry with ID ' + id + ' fetched' };
    }
    // Fetching from server, if no entry was found anywhere
    const response: BackendResponse = await getEntryById(
      this.authService.user.id,
      id
    );
    if (response.error) return { error: true, message: response.message };

    this.setEntry(response.data.entry);
    return { error: false, message: 'Entry with ID ' + id + ' fetched' };
  }

  async updateEntry() {
    const updating = {
      text: this.entryText,
      title: this.entryTitle,
      time: this.entryTime,
      tags: this.entryTags,
    };

    try {
      const response: BackendResponse = await updateEntry(this.entryId, updating);
      return response;
    } catch (error) {
      return {error: true, message: error.message}
    }
  }

  async deleteEntry() {
    const response: BackendResponse = await deleteEntry(this.entryId);

    return response;
  }

  addTag(text: string): void {
    this.entryTags.unshift(text);
  }

  deleteTag(toDeleteTag: string): void {
    this.entryTags = this.entryTags.filter((tag) => tag !== toDeleteTag);
  }
}
