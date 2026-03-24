import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Retrieves `companyId` from request context.
 * Priority: request.user.companyId -> x-company-id header -> query.companyId
 */
export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.user && req.user.companyId) return req.user.companyId;
    if (req.headers && req.headers['x-company-id'])
      return req.headers['x-company-id'];
    if (req.query && req.query.companyId) return req.query.companyId;
    return undefined;
  },
);
