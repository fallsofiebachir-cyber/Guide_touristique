import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuideTouristique, StatutGuide } from '../models/guide-touristique';
import { GuideTouristiqueService } from '../services/guide-touristique.service';
import { GuideFormComponent } from '../components/guide-form/guide-form';
import { GuideListComponent } from '../components/guide-list/guide-list';

@Component({
  selector: 'app-guides-page',
  standalone: true,
  imports: [FormsModule, GuideListComponent, GuideFormComponent],
  templateUrl: './guides-page.html',
  styleUrl: './guides-page.css',
})
export class GuidesPageComponent {
  recherche = '';
  regionSelectionnee = '';
  statutSelectionne: '' | StatutGuide = '';
  formulaireVisible = false;
  guideEnEdition: GuideTouristique | null = null;
  message = '';
  typeMessage: 'success' | 'error' = 'success';
  private temporisateur: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly guidesService: GuideTouristiqueService) {}

  get guides(): GuideTouristique[] { return this.guidesService.obtenirTous(); }
  get regions(): string[] { return [...new Set(this.guides.map((guide) => guide.region))].sort((a, b) => a.localeCompare(b, 'fr')); }
  get guidesFiltres(): GuideTouristique[] {
    const terme = this.recherche.trim().toLocaleLowerCase('fr');
    return this.guides.filter((guide) => {
      const texte = `${guide.prenom} ${guide.nom} ${guide.specialite}`.toLocaleLowerCase('fr');
      return (!terme || texte.includes(terme)) && (!this.regionSelectionnee || guide.region === this.regionSelectionnee) && (!this.statutSelectionne || guide.statut === this.statutSelectionne);
    });
  }
  get nombreActifs(): number { return this.guides.filter((guide) => guide.statut === 'Actif').length; }
  get noteMoyenne(): string {
    if (!this.guides.length) return '—';
    const moyenne = this.guides.reduce((total, guide) => total + guide.note, 0) / this.guides.length;
    return moyenne.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  ouvrirAjout(): void { this.guideEnEdition = null; this.formulaireVisible = true; }
  ouvrirModification(guide: GuideTouristique): void { this.guideEnEdition = { ...guide }; this.formulaireVisible = true; }
  fermerFormulaire(): void { this.formulaireVisible = false; this.guideEnEdition = null; }

  enregistrer(donnees: Omit<GuideTouristique, 'id'> & { id?: number }): void {
    try {
      if (donnees.id !== undefined) {
        this.guidesService.modifier(donnees as GuideTouristique);
        this.afficherMessage('La fiche du guide a été mise à jour.');
      } else {
        const { id: _id, ...nouveauGuide } = donnees;
        this.guidesService.ajouter(nouveauGuide);
        this.afficherMessage('Le guide a bien été ajouté au répertoire.');
      }
      this.fermerFormulaire();
    } catch {
      this.afficherMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
    }
  }

  supprimer(guide: GuideTouristique): void {
    const confirme = window.confirm(`Supprimer la fiche de ${guide.prenom} ${guide.nom} ? Cette action est irréversible.`);
    if (!confirme) return;
    this.guidesService.supprimer(guide.id);
    this.afficherMessage(`La fiche de ${guide.prenom} ${guide.nom} a été supprimée.`);
  }

  reinitialiserDemo(): void {
    const confirme = window.confirm('Remplacer vos changements locaux par les six fiches de démonstration ?');
    if (!confirme) return;
    this.guidesService.reinitialiserDemo();
    this.recherche = '';
    this.regionSelectionnee = '';
    this.statutSelectionne = '';
    this.afficherMessage('Les données de démonstration ont été réinitialisées.');
  }

  effacerFiltres(): void { this.recherche = ''; this.regionSelectionnee = ''; this.statutSelectionne = ''; }

  private afficherMessage(texte: string, type: 'success' | 'error' = 'success'): void {
    if (this.temporisateur) clearTimeout(this.temporisateur);
    this.message = texte;
    this.typeMessage = type;
    this.temporisateur = setTimeout(() => { this.message = ''; this.typeMessage = 'success'; }, 4500);
  }
}
