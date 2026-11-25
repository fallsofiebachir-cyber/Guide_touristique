import { Routes } from '@angular/router';
import { AboutPageComponent } from './pages/about-page';
import { GuidesPageComponent } from './pages/guides-page';

export const routes: Routes = [
  { path: '', component: GuidesPageComponent, title: 'Répertoire | Teranga Guides' },
  { path: 'a-propos', component: AboutPageComponent, title: 'À propos | Teranga Guides' },
  { path: '**', redirectTo: '' },
];
