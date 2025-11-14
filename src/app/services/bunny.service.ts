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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Bunny } from '../models/bunny';

@Injectable({ providedIn: 'root' })
export class BunnyService {
  private bunniesCol;

  constructor(private firestore: Firestore) {
    this.bunniesCol = collection(this.firestore, 'bunnies');
  }

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

  giveCarrot(id: string, amount = 1) {
    const ref = doc(this.firestore, 'bunnies', id);
    return updateDoc(ref, { carrots: increment(amount) });
  }
}
