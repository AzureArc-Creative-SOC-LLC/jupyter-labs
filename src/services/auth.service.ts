import { http } from './http'
import type {
  AuthResponse,
  VerifyResponse,
  MessageResponse,
  RegisterRequest,
  LoginRequest,
} from '../types/api'

/** Auth endpoints — see API_DOCUMENTATION-USER-ORDER § Auth. */
export const authService = {
  register: (body: RegisterRequest) =>
    http.post<AuthResponse>('/api/auth/register', body).then((r) => r.data),

  login: (body: LoginRequest) =>
    http.post<AuthResponse>('/api/auth/login', body).then((r) => r.data),

  /** GET /api/auth/verify — hydrate session on load. Requires bearer token. */
  verify: () => http.get<VerifyResponse>('/api/auth/verify').then((r) => r.data),

  forgotPassword: (email: string) =>
    http.post<MessageResponse>('/api/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    http.post<MessageResponse>('/api/auth/reset-password', { token, password }).then((r) => r.data),
}
