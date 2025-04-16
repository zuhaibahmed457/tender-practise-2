import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RoleBasedResponseSerializer implements NestInterceptor {
    private readonly dto;
    constructor(dto: any);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
