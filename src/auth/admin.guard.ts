import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly allowedRoles: string[]) {} // Receive the allowed roles as a parameter

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming the user object contains the necessary role information

    // Check if the user's role is included in the allowed roles
    if (user && this.allowedRoles.includes(user.role)) {
      return true;
    }

    return false;
  }
}
