import { Module } from '@nestjs/common';
import { MonstersService } from './monsters.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monster, MonsterSchema } from './monster.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from '../configuration/configuration';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Monster.name,
        schema: MonsterSchema,
      },
    ]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'MONSTERS_MS',
          inject: [config.KEY],
          useFactory: (configService: ConfigType<typeof config>) => {
            const { amqpServer, monstersQueueName } = configService.amqp;

            return {
              name: 'MONSTERS_MS',
              transport: Transport.RMQ,
              options: {
                urls: [amqpServer],
                queue: monstersQueueName,
                queueOptions: {
                  durable: false,
                },
              },
            };
          },
        },
      ],
    }),
  ],
  providers: [MonstersService],
  controllers: [],
})
export class MonstersModule {}
