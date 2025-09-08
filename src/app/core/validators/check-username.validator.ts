import { RegisterApiService } from '@app/api/users/register.api.service';
import { firstValueFrom } from 'rxjs';

export const createUsernameAvailabilityValidator = (registerApiService: RegisterApiService) => {
  return async (username: string): Promise<{ isValid: boolean; message?: string }> => {
    if (!username || username.trim() === '') {
      return { isValid: true };
    }

    try {
      const response = await firstValueFrom(registerApiService.checkUsername(username));
      if (response) {
        if (!response.data?.available) {
          return {
            isValid: false,
            message: response.message || 'Username não está disponível'
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