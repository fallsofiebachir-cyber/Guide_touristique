import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GuideTouristique } from '../../models/guide-touristique';

@Component({
  selector: 'app-guide-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './guide-list.html',
  styleUrl: './guide-list.css',
})
export class GuideListComponent {
  @Input() guides: GuideTouristique[] = [];
  @Output() modifier = new EventEmitter<GuideTouristique>();
  @Output() supprimer = new EventEmitter<GuideTouristique>();
}
