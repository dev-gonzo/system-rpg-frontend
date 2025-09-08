import { Injectable } from '@angular/core';

type DraftFormData = Record<string, unknown>;


@Injectable({
  providedIn: 'root',
})
export class DraftService {
  private readonly DRAFT_KEY = 'game-group-draft';
  private readonly DRAFT_STEP_KEY = 'game-group-draft-step';

  
  saveDraft(formData: DraftFormData, currentStep: number): void {
    try {
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(formData));
      localStorage.setItem(this.DRAFT_STEP_KEY, currentStep.toString());
    } catch {
      
      return;
    }
  }

  
  loadDraft(): { formData: DraftFormData; currentStep: number } | null {
    try {
      const draftData = localStorage.getItem(this.DRAFT_KEY);
      const draftStep = localStorage.getItem(this.DRAFT_STEP_KEY);

      if (draftData && draftStep) {
        return {
          formData: JSON.parse(draftData),
          currentStep: parseInt(draftStep, 10) || 0,
        };
      }
    } catch {
      
      this.clearDraft();
    }

    return null;
  }

  
  clearDraft(): void {
    try {
      localStorage.removeItem(this.DRAFT_KEY);
      localStorage.removeItem(this.DRAFT_STEP_KEY);
    } catch {
      
      return;
    }
  }

  
  hasDraft(): boolean {
    return localStorage.getItem(this.DRAFT_KEY) !== null;
  }
}