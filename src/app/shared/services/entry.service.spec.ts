import { TestBed } from '@angular/core/testing';
import { EntryService } from './entry.service';
import { EntriesService } from './entries.service';
import { AuthService } from '../auth.service';
import { Entry } from '../interfaces';

describe('EntryService', () => {
  let service: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, EntriesService],
    });
    service = TestBed.inject(EntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('entry setup (#setEntry())', () => {
    it('should setup existing entry with all fields', () => {
      const entText = 'Some text';
      const entId = 'wx2mLMf4nl53kl2';
      const entTitle = 'Title!?';
      const entCreated = new Date(2020, 7, 11, 19, 22, 0);
      const entUpdated = new Date(2020, 8, 13, 2, 2, 0);
      const entTime = new Date(2020, 7, 15, 4, 22, 0);

      const entry: Entry = {
        id: entId,
        text: entText,
        title: entTitle,
        created_at: entCreated,
        updated_at: entUpdated,
        time: entTime,
      };

      service.setEntry(entry);
      expect(service.entryId).toBe(entId);
      expect(service.entryText).toBe(entText);
      expect(service.entryTitle).toBe(entTitle);
      expect(service.entryTime).toBe(entTime);
      expect(service.entryCreated).toBe(entCreated);
      expect(service.entryUpdated).toBe(entUpdated);
    });

    it('should setup existing entry with not all fields', () => {
      const entText = 'Best text ever, you know';
      const entId = 'm2lKf8KSwk5i3lS';
      const entCreated = new Date(2020, 2, 9, 19, 22, 0);
      const entTime = new Date(2020, 2, 9, 28, 11, 0);

      const entry: Entry = {
        id: entId,
        text: entText,
        created_at: entCreated,
        time: entTime,
      };

      service.setEntry(entry);
      expect(service.entryId).toBe(entId);
      expect(service.entryText).toBe(entText);
      expect(service.entryTitle).toBe(undefined);
      expect(service.entryTime).toBe(entTime);
      expect(service.entryCreated).toBe(entCreated);
      expect(service.entryUpdated).toBe(undefined);
    });
  });

  it('should reset current entry (#reset())', () => {
    const entText = 'Some text';
    const entId = 'wx2mLMf4nl53kl2';
    const entTitle = 'Title!?';
    const entCreated = new Date(2020, 7, 11, 19, 22, 0);
    const entUpdated = new Date(2020, 8, 13, 2, 2, 0);
    const entTime = new Date(2020, 7, 15, 4, 22, 0);

    const entry: Entry = {
      id: entId,
      text: entText,
      title: entTitle,
      created_at: entCreated,
      updated_at: entUpdated,
      time: entTime,
    };

    service.setEntry(entry);
    service.reset();

    expect(service.entryId).toBe(undefined);
    expect(service.entryText).toBe(undefined);
    expect(service.entryTitle).toBe(undefined);
    expect(service.entryTime).toBe(undefined);
    expect(service.entryCreated).toBe(undefined);
    expect(service.entryUpdated).toBe(undefined);
  });

  describe('entry date setup (#setNewDate())', () => {
    it('should copy date value when entry is empty', () => {
      const date = new Date(2020, 9, 27, 11, 29, 0);
      service.setNewDate(date);

      expect(service.entryTime).toEqual(date);
    });

    it('should copy only year, month and day when entry date is already set', () => {
      const date = new Date(2020, 9, 27, 11, 29, 0);
      service.setNewDate(date);

      const anotherDate = new Date(2020, 1, 11, 17, 59, 0);
      service.setNewDate(anotherDate);
      const expectedDate = new Date(2020, 1, 11, 11, 29, 0);

      expect(service.entryTime).toEqual(expectedDate);
    });
  });

  describe('entry time setup (#setNewTime())', () => {
    it('should setup correct entry time (#setNewTime())', () => {
      const date = new Date(2020, 9, 27, 11, 29, 0);
      service.setNewDate(date);

      let time = { hours: 19, minutes: 37 };
      let expectedDate = new Date(2020, 9, 27, 19, 37, 0);

      service.setNewTime(time);
      expect(service.entryTime).toEqual(expectedDate);

      time = { hours: 0, minutes: 0 };
      expectedDate = new Date(2020, 9, 27, 0, 0, 0);

      service.setNewTime(time);
      expect(service.entryTime).toEqual(expectedDate);
    });

    it('should setup incorrect entry time (#setNewTime())', () => {
      const date = new Date(2020, 9, 27, 11, 29, 0);
      service.setNewDate(date);

      const time = { hours: -4, minutes: 99 };
      const expectedDate = new Date(2020, 9, 27, 0, 0, 0);

      service.setNewTime(time);
      expect(service.entryTime).toEqual(expectedDate);
    });
  });
});
