import { Injectable } from '@angular/core';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GlobalConfig } from '../models/global-config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private configRef;

  constructor(private firestore: Firestore) {
    this.configRef = doc(this.firestore, 'config', 'global');

    // Ensure a default config exists
    void setDoc(
      this.configRef,
      { pointsPerCarrot: 3 },
      { merge: true }
    );
  }

  getConfig(): Observable<GlobalConfig> {
    return docData(this.configRef) as Observable<GlobalConfig>;
  }

  updatePointsPerCarrot(points: number) {
    return setDoc(
      this.configRef,
      { pointsPerCarrot: points },
      { merge: true }
    );
  }
}
