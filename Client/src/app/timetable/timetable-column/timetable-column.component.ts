import {Component, Input, OnInit} from '@angular/core';
import {Mode} from '../mode.enum';

@Component({
  selector: 'app-timetable-column',
  templateUrl: './timetable-column.component.html',
  styleUrls: ['./timetable-column.component.scss']
})
export class TimetableColumnComponent implements OnInit {

  @Input() classes: any[]; // niz časova
  // mora da ima startMinutes, durationMinutes

  @Input() mode: Mode; // za proslednjivanje do timetable-class

  @Input() title: string; // npr. "ponedeljak"
  @Input() titleAbbr: string; // npr. "pon"

  @Input() beginningMinutes: number; // npr. 07:00 je 420
  @Input() showEvery: number; // npr. prikaži liniju na svakih 15 minuta
  @Input() scale: number; // koliko piksela je jedan minut

  constructor() {
  }

  getClasses() {
    this.sortAndOverlap();
    return this.classes;
  }

  public sortAndOverlap() {
    if (!this.classes || this.classes.length === 0) {
      return;
    }

    // sortiranje
    this.classes.sort((a, b) => {
      const keyA = a.startMinutes;
      const keyB = b.startMinutes;
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });
    // inicijalno su svi samostalni
    for (let i = 0; i < this.classes.length; i++) {
      this.classes[i].overlapNumber = 1;
      this.classes[i].overlapIndex = 0;
      this.classes[i].endMinutes =
        this.classes[i].startMinutes +
        this.classes[i].durationMinutes;
    }

    let overlapGroupBeginIndex = 0;
    let overlapBegin = this.classes[0].startMinutes;
    let overlapEnd = this.classes[0].endMinutes;

    for (let i = 1; i < this.classes.length; i++) {
      // trenutni se preklapa sa grupom
      if (this.classes[i].startMinutes < overlapEnd) {
        overlapEnd = Math.max(this.classes[i].endMinutes, overlapEnd);
        // svima koji su u grupi, plus ovom na kom smo sad
        // postavljamo overlap podatke
        for (let j = overlapGroupBeginIndex; j <= i; j++) {
          this.classes[j].overlapNumber = i - overlapGroupBeginIndex + 1;
          this.classes[j].overlapIndex = j - overlapGroupBeginIndex;
        }
      } else { // nema poklapanja
        overlapGroupBeginIndex = i;
        overlapBegin = this.classes[i].startMinutes;
        overlapEnd = this.classes[i].endMinutes;
      }
    }
  }

  ngOnInit() {
    this.sortAndOverlap();
  }


}
