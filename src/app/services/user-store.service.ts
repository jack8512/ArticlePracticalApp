import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private userSubject = new BehaviorSubject<User | null>(null);

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getSnapshot(): User | null {
    return this.userSubject.value;
  }
}
