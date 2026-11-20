import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

const mockSignInWithOtp = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
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
});
