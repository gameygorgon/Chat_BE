import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NewUserDTO } from './dtos/new-user.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'get-users'})
  async getUsers(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.getUsers();
  }

  @MessagePattern({ cmd: 'register' })
  async register
  (@Ctx() context: RmqContext,
  @Payload() newUser: NewUserDTO 
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.register(newUser);
  }

  // @MessagePattern({ cmd: 'checkUserExists' })
  // async findIfExist
  // (@Ctx() context: RmqContext,
  // @Payload() name: string 
  // ) {
  //   const channel = context.getChannelRef();
  //   const message = context.getMessage();
  //   channel.ack(message);

  //   return this.authService.checkUserExists(name);
  // }

  @MessagePattern({ cmd: 'checkUserExists' })
async findIfExist(
  @Ctx() context: RmqContext,
  @Payload() name: string
): Promise<boolean> {
  const channel = context.getChannelRef();
  const message = context.getMessage();
  channel.ack(message);

  const existingUser = await this.authService.checkUserExists(name);
  return !!existingUser;
}

}
