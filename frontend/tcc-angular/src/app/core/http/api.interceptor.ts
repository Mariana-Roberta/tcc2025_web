import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { HttpErrorService } from './http-error.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private errorService: HttpErrorService
  ) {}

  private montarUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url; // URLs absolutas ficam como estão
    const base = environment.apiUrl?.replace(/\/+$/, '') || '';
    const path = url.replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const rotasPublicas = [
      '/api/auth',
      '/api/usuarios'
    ];

    const url = this.montarUrl(req.url);

    const token = this.auth.getToken?.();
    const precisaAuth = !rotasPublicas.some(r => url.endsWith(r));
    let headers = req.headers.set('Accept', 'application/json');

    if (precisaAuth && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const reqClonada = req.clone({ url, headers });

    return next.handle(reqClonada).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.errorService.mapearMensagem(error);

        // ✅ Mostra o erro no console (útil para debug)
        console.error('[HTTP ERROR]', error);

        // ✅ Mantém o objeto original, apenas adicionando a mensagem mapeada
        const erroComMensagem = {
          ...error,
          message: message
        };

        // ✅ Repassa o erro completo para o componente
        return throwError(() => erroComMensagem);
      })
    );
  }
}
