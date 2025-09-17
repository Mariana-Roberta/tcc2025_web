import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
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
    // Não toca URLs absolutas
    if (/^https?:\/\//i.test(url)) return url;
    // Prefixa a base da API
    const base = environment.apiUrl?.replace(/\/+$/, '') || '';
    const path = url.replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Base URL
    const url = this.montarUrl(req.url);

    // 2) Headers (Bearer quando existir)
    const token = this.auth.getToken?.();
    const precisaAuth = !url.endsWith('/auth'); // evite forçar no login
    let headers = req.headers.set('Accept', 'application/json');

    if (precisaAuth && token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const reqClonada = req.clone({ url, headers });

    // 3) Tratamento de erros centralizado
    return next.handle(reqClonada).pipe(
      catchError((error: HttpErrorResponse) => {
        const mensagem = this.errorService.mapearMensagem(error);
        return throwError(() => new Error(mensagem));
      })
    );
  }
}
