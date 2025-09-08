import { RegisterApiService } from '@app/api/users/register.api.service';
import { firstValueFrom } from 'rxjs';

export const createEmailAvailabilityValidator = (registerApiService: RegisterApiService) => {
  return async (email: string): Promise<{ isValid: boolean; message?: string }> => {
    if (!email || email.trim() === '') {
      return { isValid: true };
    }

    
    
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { isValid: true }; 
    }

    try {
      const response = await firstValueFrom(registerApiService.checkEmail(email));
      if (response) {
        if (!response.data?.available) {
          return {
            isValid: false,
            message: response.message || 'Email não está disponível'
          };
        } else {
          
          return {
            isValid: true
          };
        }
      }
      return { isValid: true };
    } catch (error: unknown) {
        const apiError = error as { error?: { message?: string } };
        if (apiError?.error?.message) {
        return {
            isValid: false,
            message: apiError.error.message
          };
      }
      return { isValid: true }; 
    }
  };
};