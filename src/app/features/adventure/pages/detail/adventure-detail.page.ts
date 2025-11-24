import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SectionWrapperComponent } from '@app/shared/components/section-wrapper/section-wrapper.component';
import { ToastService } from '@app/shared/components/toast/toast.service';
import { AdventureApiService } from '@app/api/adventure/adventure.api.service';
import { AdventureResponse, AdventureResponseData } from '@app/api/adventure/adventure.api.types';
import { AdventureNoteApiService } from '@app/api/adventure-note/adventure-note.api.service';
import { AdventureNoteResponseData } from '@app/api/adventure-note/adventure-note.api.types';
import { InputComponent } from '@app/shared/components/form/input/input.component';
import { TextareaComponent } from '@app/shared/components/form/textarea/textarea.component';
import { ConfirmationModalService } from '@app/shared/components/confirmation-modal/confirmation-modal.service';

@Component({
  standalone: true,
  selector: 'app-adventure-detail',
  imports: [CommonModule, TranslateModule, SectionWrapperComponent, ReactiveFormsModule, MatIconModule, InputComponent, TextareaComponent],
  templateUrl: './adventure-detail.page.html',
})
export class AdventureDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly toastService = inject(ToastService);
  private readonly adventureApiService = inject(AdventureApiService);
  private readonly adventureNoteApiService = inject(AdventureNoteApiService);
  private readonly confirmationModalService = inject(ConfirmationModalService);

  adventure = signal<AdventureResponseData | null>(null);
  isLoading = signal<boolean>(false);
  private gameGroupId: string | null = null;
  private adventureId: string | null = null;

  notes = signal<AdventureNoteResponseData[]>([]);
  isAddingNote = signal<boolean>(false);
  editingNoteId: string | null = null;
  noteForm!: FormGroup;

  ngOnInit(): void {
    this.gameGroupId = this.route.parent?.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('id');
    this.adventureId = this.route.snapshot.paramMap.get('adventureId') || this.route.snapshot.paramMap.get('id');

    if (!this.adventureId) {
      this.toastService.danger(this.translate.instant('COMMON.ERROR'));
      this.navigateBack();
      return;
    }

    this.loadAdventure(this.adventureId);
    this.setupNoteForm();
    this.loadNotes();
  }

  private loadAdventure(id: string): void {
    this.isLoading.set(true);
    this.adventureApiService.getById(id).subscribe({
      next: (response: AdventureResponse) => {
        this.adventure.set(response.data ?? null);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastService.danger(this.translate.instant('COMMON.ERROR'));
        this.navigateBack();
      }
    });
  }

  private setupNoteForm(): void {
    this.noteForm = new FormGroup({
      title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100)] }),
      content: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(5), Validators.maxLength(2000)] }),
    });
  }

  loadNotes(): void {
    if (!this.adventureId) return;
    this.adventureNoteApiService.listByAdventure(this.adventureId).subscribe({
      next: (response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          this.notes.set(data);
        } else {
          this.notes.set([]);
        }
      },
      error: () => {
        this.notes.set([]);
      },
    });
  }

  toggleAddNote(): void {
    this.isAddingNote.set(!this.isAddingNote());
    if (!this.isAddingNote()) {
      this.editingNoteId = null;
      this.noteForm.reset();
    }
  }

  submitNote(): void {
    if (!this.adventureId || this.noteForm.invalid) return;
    const data = this.noteForm.getRawValue();
    if (this.editingNoteId) {
      this.adventureNoteApiService.update(this.adventureId, this.editingNoteId, data).subscribe({
        next: () => {
          this.toastService.success('Nota atualizada com sucesso!');
          this.editingNoteId = null;
          this.isAddingNote.set(false);
          this.noteForm.reset();
          this.loadNotes();
        },
        error: () => {
          this.toastService.danger('Falha ao atualizar a nota');
        },
      });
      return;
    }

    this.adventureNoteApiService.create(this.adventureId, data).subscribe({
      next: () => {
        this.toastService.success('Nota criada com sucesso!');
        this.isAddingNote.set(false);
        this.noteForm.reset();
        this.loadNotes();
      },
      error: () => {
        this.toastService.danger('Falha ao criar a nota');
      },
    });
  }

  startEditNote(note: AdventureNoteResponseData): void {
    this.isAddingNote.set(true);
    this.editingNoteId = note.id;
    this.noteForm.patchValue({ title: note.title, content: note.content });
  }

  deleteNote(note: AdventureNoteResponseData): void {
    this.confirmationModalService.showDanger(
      'Excluir nota',
      'Esta ação não pode ser desfeita. Tem certeza que deseja excluir permanentemente esta nota?',
      () => {
        if (!this.adventureId) return;
        this.adventureNoteApiService.delete(this.adventureId, note.id).subscribe({
          next: () => {
            this.toastService.success('Nota excluída!');
            this.loadNotes();
          },
          error: () => {
            this.toastService.danger('Falha ao excluir a nota');
          },
        });
      }
    );
  }

  navigateBack(): void {
    if (this.gameGroupId) {
      this.router.navigate(['/game-groups', this.gameGroupId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}