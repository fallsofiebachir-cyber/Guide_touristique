import { Injectable } from '@angular/core';
import { GuideTouristique } from '../models/guide-touristique';

const STORAGE_KEY = 'senegal-guides-touristiques-v1';

const GUIDES_DEMO: GuideTouristique[] = [
  { id: 1, prenom: 'Awa', nom: 'Diop', region: 'Dakar', langues: ['Français', 'Wolof', 'Anglais'], specialite: 'Patrimoine et histoire', email: 'awa.diop@example.sn', telephone: '+221 77 123 45 67', statut: 'Actif', note: 4.9 },
  { id: 2, prenom: 'Mamadou', nom: 'Sagna', region: 'Ziguinchor', langues: ['Français', 'Diola', 'Anglais'], specialite: 'Écotourisme', email: 'mamadou.sagna@example.sn', telephone: '+221 77 234 56 78', statut: 'Actif', note: 4.8 },
  { id: 3, prenom: 'Fatou', nom: 'Ndiaye', region: 'Saint-Louis', langues: ['Français', 'Wolof'], specialite: 'Architecture coloniale', email: 'fatou.ndiaye@example.sn', telephone: '+221 78 345 67 89', statut: 'Actif', note: 4.7 },
  { id: 4, prenom: 'Ibrahima', nom: 'Fall', region: 'Thiès', langues: ['Français', 'Sérère', 'Wolof'], specialite: 'Lac Rose et artisanat', email: 'ibrahima.fall@example.sn', telephone: '+221 70 456 78 90', statut: 'Inactif', note: 4.4 },
  { id: 5, prenom: 'Mariama', nom: 'Ba', region: 'Tambacounda', langues: ['Français', 'Pulaar'], specialite: 'Parc national du Niokolo-Koba', email: 'mariama.ba@example.sn', telephone: '+221 77 567 89 01', statut: 'Actif', note: 4.6 },
  { id: 6, prenom: 'Cheikh', nom: 'Gueye', region: 'Diourbel', langues: ['Français', 'Wolof', 'Arabe'], specialite: 'Tourisme religieux', email: 'cheikh.gueye@example.sn', telephone: '+221 76 678 90 12', statut: 'Inactif', note: 4.5 }
];

@Injectable({ providedIn: 'root' })
export class GuideTouristiqueService {
  private guides: GuideTouristique[] = this.chargerGuides();

  obtenirTous(): GuideTouristique[] {
    // Trie par ID croissant (1, 2, 3...) au lieu du nom de famille
    return [...this.guides].sort((a, b) => a.id - b.id);
  }

  ajouter(guide: Omit<GuideTouristique, 'id'>): GuideTouristique {
    const nouveauGuide: GuideTouristique = { ...guide, id: this.guides.length + 1 };
    this.guides = this.reordonnerIds([...this.guides, nouveauGuide]);
    this.sauvegarder();
    return nouveauGuide;
  }

  modifier(guide: GuideTouristique): GuideTouristique {
    this.guides = this.guides.map((item) => item.id === guide.id ? { ...guide } : item);
    this.sauvegarder();
    return guide;
  }

  supprimer(id: number): void {
    const restants = this.guides.filter((guide) => guide.id !== id);
    this.guides = this.reordonnerIds(restants);
    this.sauvegarder();
  }

  reinitialiserDemo(): void {
    this.guides = GUIDES_DEMO.map((guide) => ({ ...guide, langues: [...guide.langues] }));
    this.sauvegarder();
  }

  private reordonnerIds(liste: GuideTouristique[]): GuideTouristique[] {
    return liste.map((guide, index) => ({
      ...guide,
      id: index + 1
    }));
  }

  private chargerGuides(): GuideTouristique[] {
    try {
      const sauvegarde = localStorage.getItem(STORAGE_KEY);
      if (sauvegarde) {
        const guides: unknown = JSON.parse(sauvegarde);
        if (Array.isArray(guides)) {
          return this.reordonnerIds(guides as GuideTouristique[]);
        }
      }
    } catch {
      // Une sauvegarde locale illisible ne doit pas empêcher l'application de démarrer.
    }
    return GUIDES_DEMO.map((guide) => ({ ...guide, langues: [...guide.langues] }));
  }

  private sauvegarder(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.guides));
    } catch {
      // Les changements restent disponibles en mémoire si le stockage est indisponible.
    }
  }
}