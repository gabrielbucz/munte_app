import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

const mockSignInWithOtp = vi.fn();
const mockVerifyOtp = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
      verifyOtp: mockVerifyOtp,
    },
  })),
}));

describe('AuthService (CA1 — link de confirmação por e-mail institucional)', () => {
  let service: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService();
  });

  it('deve chamar signInWithOtp com e-mail institucional @utfpr.edu.br', async () => {
    mockSignInWithOtp.mockResolvedValue({ data: {}, error: null });

    await expect(service.requestMagicLink('aluno@utfpr.edu.br')).resolves.toBeUndefined();

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'aluno@utfpr.edu.br',
    });
  });

  it('deve rejeitar e-mail não institucional com erro de domínio não permitido', async () => {
    await expect(service.requestMagicLink('usuario@gmail.com')).rejects.toThrow(
      'e-mail não permitido'
    );

    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('deve rejeitar e-mail sem @utfpr.edu.br com erro de domínio não permitido', async () => {
    await expect(
      service.requestMagicLink('servidor@outro-dominio.com.br')
    ).rejects.toThrow('e-mail não permitido');

    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it('deve propagar erro do BaaS quando o envio do link falha', async () => {
    mockSignInWithOtp.mockResolvedValue({
      data: null,
      error: { message: 'Falha ao enviar e-mail de confirmação' },
    });

    await expect(
      service.requestMagicLink('aluno@utfpr.edu.br')
    ).rejects.toThrow('Falha ao enviar e-mail de confirmação');

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'aluno@utfpr.edu.br',
    });
  });

  describe('verifyOtp (CA2 — validação do token de confirmação)', () => {
    it('deve chamar verifyOtp com token_hash e type email', async () => {
      mockVerifyOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

      await service.verifyOtp({ token_hash: 'hash-valido', type: 'email' });

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        token_hash: 'hash-valido',
        type: 'email',
      });
    });

    it('deve chamar verifyOtp com email, token e type email (OTP de 6 dígitos)', async () => {
      mockVerifyOtp.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

      await service.verifyOtp({ email: 'aluno@utfpr.edu.br', token: '123456', type: 'email' });

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        email: 'aluno@utfpr.edu.br',
        token: '123456',
        type: 'email',
      });
    });

    it('deve propagar erro quando o token_hash é inválido ou expirado', async () => {
      mockVerifyOtp.mockResolvedValue({
        data: null,
        error: { message: 'OTP expired' },
      });

      await expect(
        service.verifyOtp({ token_hash: 'hash-expirado', type: 'email' })
      ).resolves.toEqual({ data: null, error: { message: 'OTP expired' } });

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        token_hash: 'hash-expirado',
        type: 'email',
      });
    });

    it('deve propagar erro quando email e token são inválidos ou expirados', async () => {
      mockVerifyOtp.mockResolvedValue({
        data: null,
        error: { message: 'OTP expired' },
      });

      await expect(
        service.verifyOtp({
          email: 'aluno@utfpr.edu.br',
          token: '123456',
          type: 'email',
        })
      ).resolves.toEqual({ data: null, error: { message: 'OTP expired' } });

      expect(mockVerifyOtp).toHaveBeenCalledWith({
        email: 'aluno@utfpr.edu.br',
        token: '123456',
        type: 'email',
      });
    });
  });
});
