import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IIdGenerator } from '../../core/ports/id-generator.port';

@Injectable()
export class IdGeneratorService implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
