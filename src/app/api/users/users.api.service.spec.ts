import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersApiService } from './users.api.service';
import { API_URL } from '@app/core/tokens/api-base-url.token';
import {
  UserSearchParams,
  UserSearchResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserGetByIdResponse,
  UserUpdateRequest,
  UserUpdateResponse,
  UserDeleteResponse,
  UserToggleStatusResponse,
  UserVerifyEmailResponse,
  UserData
} from './users.api.types';

describe('UsersApiService', () => {
  let service: UsersApiService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'http://localhost:8080';
  const basePath = '/api/v1/users';

  const mockUserData: UserData = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: [{ id: '1', name: 'USER', description: 'User role', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }],
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z',
    lastLoginAt: '2024-01-01T12:00:00Z',
    passwordChangedAt: '2024-01-01T10:00:00Z',
    _links: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersApiService,
        { provide: API_URL, useValue: mockBaseUrl }
      ]
    });
    service = TestBed.inject(UsersApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listUsers', () => {
    it('should send GET request with default parameters', () => {
      const mockResponse: UserSearchResponse = {
        message: 'Users retrieved successfully',
        timestamp: Date.now(),
        data: {
          content: [mockUserData],
          _links: [],
          page: {
            number: 0,
            size: 20,
            totalElements: 1,
            totalPages: 1,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
            numberOfElements: 1
          }
        },
        _links: []
      };

      service.listUsers().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}?page=0&size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should send GET request with custom parameters and sort', () => {
      const page = 1;
      const size = 10;
      const sort = ['username,asc', 'createdAt,desc'];
      const mockResponse: UserSearchResponse = {
        message: 'Users retrieved successfully',
        timestamp: Date.now(),
        data: {
          content: [],
          _links: [],
          page: {
            number: 1,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
            numberOfElements: 0
          }
        },
        _links: []
      };

      service.listUsers(page, size, sort).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}?page=1&size=10&sort=username,asc&sort=createdAt,desc`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('searchUsers', () => {
    it('should send GET request with search parameters', () => {
      const searchParams: UserSearchParams = {
        username: 'test',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        page: 0,
        size: 10,
        sort: ['username,asc']
      };
      const mockResponse: UserSearchResponse = {
        message: 'Users searched successfully',
        timestamp: Date.now(),
        data: {
          content: [],
          _links: [],
          page: {
            number: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
            numberOfElements: 0
          }
        },
        _links: []
      };

      service.searchUsers(searchParams).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => {
        return request.url === `${mockBaseUrl}${basePath}/search` &&
               request.params.get('username') === 'test' &&
               request.params.get('firstName') === 'John' &&
               request.params.get('lastName') === 'Doe' &&
               request.params.get('email') === 'john@example.com' &&
               request.params.get('page') === '0' &&
               request.params.get('size') === '10' &&
               request.params.get('sort') === 'username,asc';
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should send GET request with partial search parameters', () => {
      const searchParams: UserSearchParams = {
        username: 'test'
      };
      const mockResponse: UserSearchResponse = {
        message: 'Users searched successfully',
        timestamp: Date.now(),
        data: {
          content: [],
          _links: [],
          page: {
            number: 0,
            size: 20,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true,
            hasNext: false,
            hasPrevious: false,
            numberOfElements: 0
          }
        },
        _links: []
      };

      service.searchUsers(searchParams).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => {
        return request.url === `${mockBaseUrl}${basePath}/search` &&
               request.params.get('username') === 'test' &&
               !request.params.has('firstName');
      });
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getUserById', () => {
    it('should send GET request to retrieve user by ID', () => {
      const userId = '123';
      const mockResponse: UserGetByIdResponse = {
        message: 'User retrieved successfully',
        timestamp: Date.now(),
        data: mockUserData,
        _links: []
      };

      service.getUserById(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle user not found error', () => {
      const userId = '999';

      service.getUserById(userId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser', () => {
    it('should send POST request to create user', () => {
      const createRequest: UserCreateRequest = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        roles: ['USER']
      };

      const mockResponse: UserCreateResponse = {
        message: 'User created successfully',
        timestamp: Date.now(),
        data: mockUserData,
        _links: []
      };

      service.createUser(createRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockResponse);
    });

    it('should handle validation error', () => {
      const createRequest: UserCreateRequest = {
        username: '',
        email: 'invalid-email',
        password: '123',
        firstName: '',
        lastName: '',
        roles: []
      };

      service.createUser(createRequest).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}`);
      req.flush('Validation failed', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should send PUT request to update user', () => {
      const userId = '123';
      const updateRequest: UserUpdateRequest = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      const updatedUserData = { ...mockUserData, firstName: 'Updated', lastName: 'Name' };
        const mockResponse: UserUpdateResponse = {
          message: 'User updated successfully',
          timestamp: Date.now(),
          data: updatedUserData,
          _links: []
        };

      service.updateUser(userId, updateRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should send DELETE request to remove user', () => {
      const userId = '123';
      const mockResponse: UserDeleteResponse = {
        message: 'User deleted successfully',
        timestamp: Date.now(),
        data: null,
        _links: []
      };

      service.deleteUser(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('toggleUserStatus', () => {
    it('should send PATCH request to activate user', () => {
      const userId = '123';
      const active = true;
      const toggledUserData = { ...mockUserData, isActive: true };
        const mockResponse: UserToggleStatusResponse = {
          message: 'User status updated successfully',
          timestamp: Date.now(),
          data: toggledUserData,
          _links: []
        };

      service.toggleUserStatus(userId, active).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(request => {
        return request.url === `${mockBaseUrl}${basePath}/${userId}/status` &&
               request.params.get('active') === 'true';
      });
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should send PATCH request to deactivate user', () => {
      const userId = '123';
      const active = false;
      const mockResponse: UserToggleStatusResponse = {
        message: 'User status updated successfully',
        timestamp: Date.now(),
        data: { ...mockUserData, isActive: false },
        _links: []
      };

      service.toggleUserStatus(userId, active).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}/status?active=false`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });

  describe('verifyUserEmail', () => {
    it('should send PATCH request to verify user email', () => {
      const userId = '123';
      const verifiedUserData = { ...mockUserData, isEmailVerified: true };
        const mockResponse: UserVerifyEmailResponse = {
          message: 'Email verified successfully',
          timestamp: Date.now(),
          data: verifiedUserData,
          _links: []
        };

      service.verifyUserEmail(userId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${mockBaseUrl}${basePath}/${userId}/verify-email`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });
  });

  describe('service properties', () => {
    it('should have correct basePath', () => {
      expect(service.basePath).toBe('/api/v1/users');
    });
  });
});