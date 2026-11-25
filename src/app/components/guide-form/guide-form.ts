import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuideTouristique, StatutGuide } from '../../models/guide-touristique';

@Component({
  selector: 'app-guide-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './guide-form.html',
  styleUrl: './guide-form.css',
})
export class GuideFormComponent implements OnChanges {
  @Input() guide: GuideTouristique | null = null;
  @Output() enregistrer = new EventEmitter<Omit<GuideTouristique, 'id'> & { id?: number }>();
  @Output() annuler = new EventEmitter<void>();

  readonly regions = ['Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'];
  readonly statuts: StatutGuide[] = ['Actif', 'Inactif'];
  submitted = false;
  private readonly fb = inject(FormBuilder);

  readonly formulaire = this.fb.nonNullable.group({
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    telephone: ['', [Validators.required, Validators.pattern(/^\+?221[\s.-]?(?:7[05678])(?:[\s.-]?\d){7}$|^7[05678](?:[\s.-]?\d){7}$/)]],
    region: ['', Validators.required],
    specialite: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    statut: this.fb.nonNullable.control<StatutGuide>('Actif', Validators.required),
    note: [4.5, [Validators.required, Validators.min(0), Validators.max(5)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['guide']) return;
    this.submitted = false;
    if (this.guide) {
      this.formulaire.reset({
        prenom: this.guide.prenom,
        nom: this.guide.nom,
        email: this.guide.email,
        telephone: this.guide.telephone,
        region: this.guide.region,
        specialite: this.guide.specialite,
        statut: this.guide.statut,
        note: this.guide.note,
      });
    } else {
      this.formulaire.reset({ prenom: '', nom: '', email: '', telephone: '', region: '', specialite: '', statut: 'Actif', note: 4.5 });
    }
  }

  controlInvalide(nom: string): boolean {
    const controle = this.formulaire.get(nom);
    return Boolean(controle && controle.invalid && (controle.touched || this.submitted));
  }

  erreurPour(nom: string): string {
    const controle = this.formulaire.get(nom);
    if (!controle?.errors) return '';
    if (controle.errors['required']) return 'Ce champ est obligatoire.';
    if (controle.errors['email']) return 'Saisissez une adresse e-mail valide.';
    if (controle.errors['pattern']) return 'Saisissez un numéro sénégalais valide (ex. +221 77 123 45 67).';
    if (controle.errors['minlength']) return `Saisissez au moins ${controle.errors['minlength'].requiredLength} caractères.`;
    if (controle.errors['maxlength']) return `Ne dépassez pas ${controle.errors['maxlength'].requiredLength} caractères.`;
    if (controle.errors['min'] || controle.errors['max']) return 'La note doit être comprise entre 0 et 5.';
    return 'Valeur invalide.';
  }

  soumettre(): void {
  this.submitted = true;
  console.log('Formulaire valide ?', this.formulaire.valid);
  console.log('Valeurs :', this.formulaire.getRawValue());
  console.log('Erreurs :', this.formulaire.errors);

  if (this.formulaire.invalid) {
    this.formulaire.markAllAsTouched();
    return;
  }
  const valeur = this.formulaire.getRawValue();
  this.enregistrer.emit({ ...valeur, ...(this.guide ? { id: this.guide.id } : {}) });
}
}
