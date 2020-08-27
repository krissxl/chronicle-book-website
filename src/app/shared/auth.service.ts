import { Injectable } from '@angular/core';
import {
  signUpNewUser,
  signIn,
  signOut,
  getUserEntriesCount,
  sendReset,
} from './api/firebase.js';
import { User, BackendResponse } from './interfaces.js';
import * as firebase from 'firebase/app';
import { getFullDateName } from './scripts/date.js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User = {
    id: null,
    name: null,
    email: null,
    entriesCount: null,
  };
  loading = true;

  constructor() {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        this.user.email = user.email;
        this.user.name = user.displayName;
        this.user.id = user.uid;

        const response: BackendResponse = await getUserEntriesCount(user.uid);
        if (!response.error)
          this.user.entriesCount = response.data.entriesCount;
      } else {
        this.user.email = null;
        this.user.name = null;
        this.user.id = null;
        this.user.entriesCount = null;
      }
      this.loading = false;
    });
  }

  async signUpUser(
    email: String,
    password: String,
    username: String
  ): Promise<BackendResponse> {
    const response: BackendResponse = await signUpNewUser(
      email,
      password,
      username
    );

    if (!response.error) this.user.name = response.data.user.displayName;
    return { error: false, message: response.message };
  }

  async signIn(email: String, password: String): Promise<BackendResponse> {
    const response: BackendResponse = await signIn(email, password);

    return { error: false, message: response.message };
  }

  async signOut(): Promise<BackendResponse> {
    const response: BackendResponse = await signOut();

    return { error: false, message: response.message };
  }

  async sendResetEmail(email: string) {
    const response: BackendResponse = await sendReset(email);
    return response;
  }

  addEntriesCount(date: Date): void {
    const dateName = getFullDateName(date);
    const count = this.user.entriesCount[dateName];
    this.user.entriesCount[dateName] = count ? count + 1 : 1;
  }

  subEntriesCount(date: Date): void {
    const dateName = getFullDateName(date);
    const count = this.user.entriesCount[dateName];
    this.user.entriesCount[dateName] = count ? count - 1 : 0;
  }
}
