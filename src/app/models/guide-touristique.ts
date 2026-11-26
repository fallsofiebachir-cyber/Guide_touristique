export type StatutGuide = 'Actif' | 'Inactif';

export interface GuideTouristique {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  region: string;
  langues: string[];
  specialite: string;
  statut: StatutGuide;
  note: number;
}
