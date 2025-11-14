import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  increment,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bunny } from '../models/bunny';
import { BunnyEvent } from '../models/bunny-event';

@Injectable({ providedIn: 'root' })
export class BunnyService {
  private bunniesCol;

  constructor(private firestore: Firestore) {
    this.bunniesCol = collection(this.firestore, 'bunnies');
  }

  // --- bunnies ---

  getBunnies(): Observable<Bunny[]> {
    return collectionData(this.bunniesCol, { idField: 'id' }) as Observable<Bunny[]>;
  }

  getBunny(id: string): Observable<Bunny | undefined> {
    const ref = doc(this.firestore, 'bunnies', id);
    return docData(ref, { idField: 'id' }) as Observable<Bunny | undefined>;
  }

  addBunny(name: string) {
    return addDoc(this.bunniesCol, {
      name,
      createdAt: new Date(),
      carrots: 0,
    });
  }

  async deleteBunny(id: string) {
    const ref = doc(this.firestore, 'bunnies', id);
    // NOTE: events subcollection will remain; for this assignment that's OK.
    await deleteDoc(ref);
  }

  // --- events ---

  private bunnyEventsCol(bunnyId: string) {
    return collection(this.firestore, `bunnies/${bunnyId}/events`);
  }

  getEventsForBunny(bunnyId: string): Observable<BunnyEvent[]> {
    const q = query(this.bunnyEventsCol(bunnyId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<BunnyEvent[]>;
  }

  async giveCarrot(id: string, amount = 1) {
    const bunnyRef = doc(this.firestore, 'bunnies', id);
    const eventsCol = this.bunnyEventsCol(id);

    // record event + increment carrots
    await Promise.all([
      addDoc(eventsCol, {
        type: 'CARROT_GIVEN',
        amount,
        createdAt: new Date(),
      }),
      updateDoc(bunnyRef, { carrots: increment(amount) }),
    ]);
  }
}
