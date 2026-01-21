import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/client.js';
import { PrismaUtil } from '../common/utils/prisma.util.js';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = PrismaUtil.prismaPg();
    super({ adapter });
  }
}
