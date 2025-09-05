import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasswordComponent } from './password.component';


describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PasswordComponent,
        ReactiveFormsModule,
    
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    component.passwordControl = new FormControl('');
    component.confirmPasswordControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.passwordLabel).toBe('Senha');
    expect(component.confirmPasswordLabel).toBe('Confirmar Senha');
    expect(component.passwordPlaceholder).toBe('Digite sua senha');
    expect(component.confirmPasswordPlaceholder).toBe('Confirme sua senha');
    expect(component.showCriteria).toBeFalse();
    expect(component.isPasswordFocused).toBeFalse();
    expect(component.passwordFieldType).toBe('password');
    expect(component.confirmPasswordFieldType).toBe('password');
  });

  it('should generate correct input IDs', () => {
    component.passwordLabel = 'Nova Senha';
    component.confirmPasswordLabel = 'Confirme Nova Senha';
    expect(component.passwordInputId).toBe('password-nova-senha');
    expect(component.confirmPasswordInputId).toBe('confirm-password-confirme-nova-senha');
  });

  it('should use custom IDs when provided', () => {
    component.passwordId = 'custom-password';
    component.confirmPasswordId = 'custom-confirm';
    expect(component.passwordInputId).toBe('custom-password');
    expect(component.confirmPasswordInputId).toBe('custom-confirm');
  });

  it('should return null when password control is not touched', () => {
    expect(component.passwordError).toBeNull();
    expect(component.confirmPasswordError).toBeNull();
  });

  it('should return error message when password control has errors', () => {
    component.passwordControl.setErrors({ message: 'Senha inválida' });
    component.passwordControl.markAsTouched();
    expect(component.passwordError).toBe('Senha inválida');
  });

  it('should return error message when confirm password control has errors', () => {
    component.confirmPasswordControl.setErrors({ message: 'Senhas não conferem' });
    component.confirmPasswordControl.markAsTouched();
    expect(component.confirmPasswordError).toBe('Senhas não conferem');
  });

  it('should evaluate password value correctly', () => {
    component.passwordControl.setValue('');
    expect(component.passwordValue).toBe('');
    
    component.passwordControl.setValue('test123');
    expect(component.passwordValue).toBe('test123');
  });

  it('should evaluate password criteria correctly', () => {
    component.passwordControl.setValue('abc');
    let criteria = component.passwordCriteria;
    expect(criteria.hasMinLength).toBeFalse();
    expect(criteria.hasUppercase).toBeFalse();
    expect(criteria.hasLowercase).toBeTrue();
    expect(criteria.hasNumber).toBeFalse();
    expect(criteria.hasSpecialChar).toBeFalse();

    component.passwordControl.setValue('Abc123!@#');
    criteria = component.passwordCriteria;
    expect(criteria.hasMinLength).toBeTrue();
    expect(criteria.hasUppercase).toBeTrue();
    expect(criteria.hasLowercase).toBeTrue();
    expect(criteria.hasNumber).toBeTrue();
    expect(criteria.hasSpecialChar).toBeTrue();
  });

  it('should calculate password strength correctly', () => {
    component.passwordControl.setValue('abc');
    let strength = component.passwordStrength;
    expect(strength.score).toBe(1);
    expect(strength.label).toBe('fraca');
    expect(strength.class).toBe('danger');

    component.passwordControl.setValue('Abc123');
    strength = component.passwordStrength;
    expect(strength.score).toBe(3);
    expect(strength.label).toBe('média');
    expect(strength.class).toBe('warning');

    component.passwordControl.setValue('Abc123!@#');
    strength = component.passwordStrength;
    expect(strength.score).toBe(5);
    expect(strength.label).toBe('forte');
    expect(strength.class).toBe('success');
  });

  it('should return password strength with prefix', () => {
    component.passwordControl.setValue('abc');
    expect(component.passwordStrengthWithPrefix).toBe('Senha fraca');

    component.passwordControl.setValue('Abc123!@#');
    expect(component.passwordStrengthWithPrefix).toBe('Senha forte');
  });

  it('should evaluate password validity', () => {
    component.passwordControl.setValue('abc');
    expect(component.isPasswordValid).toBeFalse();

    component.passwordControl.setValue('Abc123!@#');
    expect(component.isPasswordValid).toBeTrue();
  });

  it('should handle password focus events', () => {
    component.onPasswordFocus();
    expect(component.isPasswordFocused).toBeTrue();
    expect(component.showCriteria).toBeTrue();
  });

  it('should handle password blur events', () => {
    component.onPasswordBlur();
    expect(component.isPasswordFocused).toBeFalse();
    expect(component.showCriteria).toBeFalse();
  });

  it('should handle password input events', () => {
    component.isPasswordFocused = true;

    component.passwordControl.setValue('abc');
    component.onPasswordInput();
    expect(component.showCriteria).toBeTrue();

    component.passwordControl.setValue('Abc123!@#');
    component.onPasswordInput();
    expect(component.showCriteria).toBeFalse();
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility();
    expect(component.passwordFieldType).toBe('text');

    component.togglePasswordVisibility();
    expect(component.passwordFieldType).toBe('password');
  });

  it('should toggle confirm password visibility', () => {
    component.toggleConfirmPasswordVisibility();
    expect(component.confirmPasswordFieldType).toBe('text');

    component.toggleConfirmPasswordVisibility();
    expect(component.confirmPasswordFieldType).toBe('password');
  });

  it('should calculate criteria position', () => {
    const mockContainer = document.createElement('div');
    const mockCriteria = document.createElement('div');
    mockContainer.classList.add('input-group');
    mockContainer.appendChild(mockCriteria);
    mockCriteria.classList.add('password-criteria');
    
    const mockInputContainer = document.createElement('div');
    mockInputContainer.id = component.passwordInputId;
    mockContainer.appendChild(mockInputContainer);
    
    document.body.appendChild(mockContainer);
    
    spyOnProperty(window, 'innerHeight').and.returnValue(1000);
    spyOnProperty(window, 'innerWidth').and.returnValue(1000);
    
    spyOn(mockContainer, 'getBoundingClientRect').and.returnValue({
      top: 500,
      bottom: 600,
      left: 500,
      right: 600
    } as DOMRect);
    
    spyOn(mockCriteria, 'getBoundingClientRect').and.returnValue({
      height: 200,
      width: 200
    } as DOMRect);
    
    component.calculateCriteriaPosition();
    
    expect(component.criteriaPosition.up).toBeFalse();
    expect(component.criteriaPosition.right).toBeFalse();
    
    document.body.removeChild(mockContainer);
  });


  it('should handle missing criteria container gracefully', () => {
    component.calculateCriteriaPosition();
    expect(component.criteriaPosition.up).toBeFalse();
    expect(component.criteriaPosition.right).toBeFalse();
  });

  it('should handle no password errors correctly', () => {
    component.passwordControl.setErrors(null);
    component.passwordControl.markAsTouched();
    expect(component.passwordError).toBeNull();
  });

  it('should handle empty password value', () => {
    component.passwordControl.setValue('');
    expect(component.passwordValue).toBe('');
    expect(component.passwordStrength.score).toBe(0);
    expect(component.passwordStrength.label).toBe('fraca');
    expect(component.passwordStrength.class).toBe('danger');
  });


  it('should evaluate password criteria with different special characters', () => {
    component.passwordControl.setValue('Test#123');
    let criteria = component.passwordCriteria;
    expect(criteria.hasSpecialChar).toBeTrue();

    component.passwordControl.setValue('Test@123');
    criteria = component.passwordCriteria;
    expect(criteria.hasSpecialChar).toBeTrue();

    component.passwordControl.setValue('Test$123');
    criteria = component.passwordCriteria;
    expect(criteria.hasSpecialChar).toBeTrue();
  });


  it('should handle show criteria in different scenarios', () => {
    
    component.onPasswordFocus();
    expect(component.showCriteria).toBeTrue();

    
    component.passwordControl.setValue('abc');
    component.onPasswordBlur();
    expect(component.showCriteria).toBeFalse();

    
    component.onPasswordFocus();
    expect(component.showCriteria).toBeTrue();

    
    component.passwordControl.setValue('Abc123!@#');
    component.onPasswordInput();
    expect(component.showCriteria).toBeFalse();
  });

  it('should integrate focus and input events correctly', () => {
    
    expect(component.isPasswordFocused).toBeFalse();
    expect(component.showCriteria).toBeFalse();

    
    component.onPasswordFocus();
    expect(component.isPasswordFocused).toBeTrue();
    expect(component.showCriteria).toBeTrue();

    
    component.passwordControl.setValue('abc');
    component.onPasswordInput();
    expect(component.showCriteria).toBeTrue();

    
    component.passwordControl.setValue('Abc123!@#');
    component.onPasswordInput();
    expect(component.showCriteria).toBeFalse();

    
    component.onPasswordBlur();
    expect(component.isPasswordFocused).toBeFalse();
    expect(component.showCriteria).toBeFalse();
  });

  describe('Error Handling', () => {
    it('should handle password error when message is not a string', () => {
      component.passwordControl.setErrors({ someError: true });
      component.passwordControl.markAsTouched();
      expect(component.passwordError).toBeNull();
    });

    it('should handle confirm password error when message is not a string', () => {
      component.confirmPasswordControl.setErrors({ someError: true });
      component.confirmPasswordControl.markAsTouched();
      expect(component.confirmPasswordError).toBeNull();
    });

    it('should return password error when message is a string', () => {
      component.passwordControl.setErrors({ message: 'Password is required' });
      component.passwordControl.markAsTouched();
      expect(component.passwordError).toBe('Password is required');
    });

    it('should return confirm password error when message is a string', () => {
      component.confirmPasswordControl.setErrors({ message: 'Passwords do not match' });
      component.confirmPasswordControl.markAsTouched();
      expect(component.confirmPasswordError).toBe('Passwords do not match');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle confirm password visibility', () => {
      expect(component.confirmPasswordFieldType).toBe('password');
      
      component.toggleConfirmPasswordVisibility();
      expect(component.confirmPasswordFieldType).toBe('text');
      
      component.toggleConfirmPasswordVisibility();
      expect(component.confirmPasswordFieldType).toBe('password');
    });
  });

  describe('Criteria Position Calculation', () => {
    it('should calculate criteria position when elements exist', () => {
      
      const mockContainer = document.createElement('div');
      mockContainer.className = 'input-group';
      const mockInput = document.createElement('input');
      mockInput.id = component.passwordInputId;
      const mockCriteria = document.createElement('div');
      mockCriteria.className = 'password-criteria';
      
      mockContainer.appendChild(mockInput);
      mockContainer.appendChild(mockCriteria);
      document.body.appendChild(mockContainer);
      
      
      spyOn(mockContainer, 'getBoundingClientRect').and.returnValue({
        bottom: 100,
        top: 50,
        left: 50,
        right: 200,
        width: 150,
        height: 50
      } as DOMRect);
      
      
      spyOn(mockCriteria, 'getBoundingClientRect').and.returnValue({
        height: 400,
        width: 400
      } as DOMRect);
      
      
      spyOnProperty(window, 'innerHeight', 'get').and.returnValue(600);
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(800);
      
      
      component.criteriaPosition = { up: false, right: false };
      
      component.calculateCriteriaPosition();
      
      
      expect(component.criteriaPosition.up).toBeFalse();
      
      expect(component.criteriaPosition.right).toBeFalse();
      
      document.body.removeChild(mockContainer);
    });

    it('should set criteria position up when space below is insufficient', () => {
      const mockContainer = document.createElement('div');
      mockContainer.className = 'input-group';
      const mockInput = document.createElement('input');
      mockInput.id = component.passwordInputId;
      const mockCriteria = document.createElement('div');
      mockCriteria.className = 'password-criteria';
      
      mockContainer.appendChild(mockInput);
      mockContainer.appendChild(mockCriteria);
      document.body.appendChild(mockContainer);
      
      spyOn(document, 'querySelector').and.returnValue(mockInput);
      spyOn(mockInput, 'closest').and.returnValue(mockContainer);
      spyOn(mockContainer, 'querySelector').and.returnValue(mockCriteria);
      
      spyOn(mockContainer, 'getBoundingClientRect').and.returnValue({
        bottom: 550,
        top: 350,
        left: 50,
        right: 200,
        width: 150,
        height: 50
      } as DOMRect);
      
      spyOn(mockCriteria, 'getBoundingClientRect').and.returnValue({
        height: 300,
        width: 200
      } as DOMRect);
      
      spyOnProperty(window, 'innerHeight', 'get').and.returnValue(600);
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(800);
      
      
      component.criteriaPosition = { up: false, right: false };
      
      component.calculateCriteriaPosition();
      
      
      expect(component.criteriaPosition.up).toBeTrue();
      
      document.body.removeChild(mockContainer);
    });

    it('should set criteria position right when space right is insufficient', () => {
      const mockContainer = document.createElement('div');
      mockContainer.className = 'input-group';
      const mockInput = document.createElement('input');
      mockInput.id = component.passwordInputId;
      const mockCriteria = document.createElement('div');
      mockCriteria.className = 'password-criteria';
      
      mockContainer.appendChild(mockInput);
      mockContainer.appendChild(mockCriteria);
      document.body.appendChild(mockContainer);
      
      spyOn(document, 'querySelector').and.returnValue(mockInput);
      spyOn(mockInput, 'closest').and.returnValue(mockContainer);
      spyOn(mockContainer, 'querySelector').and.returnValue(mockCriteria);
      
      spyOn(mockContainer, 'getBoundingClientRect').and.returnValue({
        bottom: 100,
        top: 50,
        left: 500,
        right: 600,
        width: 100,
        height: 50
      } as DOMRect);
      
      
      spyOn(mockCriteria, 'getBoundingClientRect').and.returnValue({
        height: 200,
        width: 320
      } as DOMRect);
      
      spyOnProperty(window, 'innerHeight', 'get').and.returnValue(600);
      spyOnProperty(window, 'innerWidth', 'get').and.returnValue(700);
      
      
      component.criteriaPosition = { up: false, right: false };
      
      component.calculateCriteriaPosition();
      
      
      expect(component.criteriaPosition.right).toBeTrue();
      
      document.body.removeChild(mockContainer);
    });
  });
});
