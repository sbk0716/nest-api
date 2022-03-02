import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    console.info('data=', data);
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    console.info('user=', user);
    return data ? user?.[data] : user;
  },
);