import { Injectable } from '@angular/core';
import { GuideTouristique } from '../models/guide-touristique';

const STORAGE_KEY = 'senegal-guides-touristiques-v1';

const GUIDES_DEMO: GuideTouristique[] = [
  { id: 1, prenom: 'Awa', nom: 'Diop', email: 'awa.diop@example.sn', telephone: '+221 77 123 45 67', region: 'Dakar', specialite: 'Patrimoine et histoire', statut: 'Actif', note: 4.9 },
  { id: 2, prenom: 'Moussa', nom: 'Ndiaye', email: 'moussa.ndiaye@example.sn', telephone: '+221 76 234 56 78', region: 'Saint-Louis', specialite: 'Architecture coloniale', statut: 'Actif', note: 4.7 },
  { id: 3, prenom: 'Fatou', nom: 'Sarr', email: 'fatou.sarr@example.sn', telephone: '+221 78 345 67 89', region: 'Ziguinchor', specialite: 'Écotourisme et mangrove', statut: 'Actif', note: 4.8 },
  { id: 4, prenom: 'Ibrahima', nom: 'Fall', email: 'ibrahima.fall@example.sn', telephone: '+221 70 456 78 90', region: 'Thiès', specialite: 'Lac Rose et artisanat', statut: 'Inactif', note: 4.4 },
  { id: 5, prenom: 'Mariama', nom: 'Ba', email: 'mariama.ba@example.sn', telephone: '+221 77 567 89 01', region: 'Tambacounda', specialite: 'Parc national du Niokolo-Koba', statut: 'Actif', note: 4.6 },
  { id: 6, prenom: 'Cheikh', nom: 'Gueye', email: 'cheikh.gueye@example.sn', telephone: '+221 76 678 90 12', region: 'Diourbel', specialite: 'Tourisme religieux', statut: 'Inactif', note: 4.5 },
];

@Injectable({ providedIn: 'root' })
export class GuideTouristiqueService {
  private guides: GuideTouristique[] = this.chargerGuides();

  obtenirTous(): GuideTouristique[] {
    return [...this.guides].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
  }

  ajouter(guide: Omit<GuideTouristique, 'id'>): GuideTouristique {
    const nouvelId = Math.max(0, ...this.guides.map((item) => item.id)) + 1;
    const nouveauGuide: GuideTouristique = { ...guide, id: nouvelId };
    this.guides = [...this.guides, nouveauGuide];
    this.sauvegarder();
    return nouveauGuide;
  }

  modifier(guide: GuideTouristique): GuideTouristique {
    this.guides = this.guides.map((item) => item.id === guide.id ? { ...guide } : item);
    this.sauvegarder();
    return guide;
  }

  supprimer(id: number): void {
    this.guides = this.guides.filter((guide) => guide.id !== id);
    this.sauvegarder();
  }

  reinitialiserDemo(): void {
    this.guides = GUIDES_DEMO.map((guide) => ({ ...guide }));
    this.sauvegarder();
  }

  private chargerGuides(): GuideTouristique[] {
    try {
      const sauvegarde = localStorage.getItem(STORAGE_KEY);
      if (sauvegarde) {
        const guides: unknown = JSON.parse(sauvegarde);
        if (Array.isArray(guides)) return guides as GuideTouristique[];
      }
    } catch {
      // Une sauvegarde locale illisible ne doit pas empêcher l'application de démarrer.
    }
    return GUIDES_DEMO.map((guide) => ({ ...guide }));
  }

  private sauvegarder(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.guides));
    } catch {
      // Les changements restent disponibles en mémoire si le stockage est indisponible.
    }
  }
}
