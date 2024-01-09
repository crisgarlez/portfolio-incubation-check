import { Module } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monster, MonsterSchema } from './monster.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Monster.name,
        schema: MonsterSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'MONSTERS_MS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'monsters_ms_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [MonstersService],
})
export class MonstersModule {}
