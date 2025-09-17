import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
  private readonly debug = true;

  mapearMensagem(error: HttpErrorResponse): string {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.error('[HTTP ERROR]', { status: error.status, url: error.url, error });
    }

    // Rede / CORS / servidor offline
    if (error.status === 0) return 'Servidor indisponível ou erro de conexão.';

    // Erro do cliente (ex.: abort, offline)
    if (error.error instanceof ErrorEvent) {
      return `Erro do cliente: ${error.error.message}`;
    }

    if (error.status === 401) return 'Sessão expirada ou inválida. Faça login novamente.';
    if (error.status === 403) return 'Acesso negado. Você não tem permissão para esta operação.';

    // Prioriza mensagens do backend
    if (typeof error.error === 'string' && error.error.trim().length) return error.error;
    if (error.error && typeof error.error === 'object' && error.error.message) return error.error.message;

    return 'Ocorreu um erro inesperado no servidor.';
  }
}
