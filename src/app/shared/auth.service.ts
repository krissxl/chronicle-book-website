import { Injectable } from '@angular/core';
import { signUpNewUser, signIn, signOut } from './api/firebase.js';
import { User, BackendResponse } from './interfaces.js';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User = {
    id: null,
    name: null,
    email: null,
  };
  loading = true;

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user.email = user.email;
        this.user.name = user.displayName;
        this.user.id = user.uid;
      } else {
        this.user.email = '';
        this.user.name = '';
        this.user.id = '';
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

    if (response.error) {
      return { error: true, message: response.message };
    } else {
      this.user.name = response.data.user.displayName

      return { error: false, message: response.message };
    }
  }

  async signIn(email: String, password: String): Promise<BackendResponse> {
    const response: BackendResponse = await signIn(email, password);

    if (response.error) {
      return { error: true, message: response.message };
    } else {
      return { error: false, message: response.message };
    }
  }

  async signOut(): Promise<BackendResponse> {
    const response: BackendResponse = await signOut();

    if (response.error) {
      return {error: true, message: response.message}
    } else {
      return {error: false, message: response.message}
    }
  }
}
