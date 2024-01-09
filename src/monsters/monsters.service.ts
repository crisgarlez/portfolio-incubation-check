import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Monster } from './monster.schema';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MonstersService {
  private readonly logger = new Logger(MonstersService.name);

  constructor(
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
    @Inject('MONSTERS_MS') private client: ClientProxy,
  ) {}

  // @Cron('0 0/5 * * * *')
  @Cron('* * * * * ')
  async handleCron() {
    this.logger.debug('Procesando incubación de monstruos...');

    const currentTime = new Date();

    this.logger.debug('currentTime:' + currentTime.getTime());

    const incubatingMonsters: any[] = await this.monsterModel.find({
      $and: [
        {
          incubationTime: { $lte: currentTime.getTime() },
        },
        {
          status: 'INCUBATING',
        },
      ],
    });

    this.logger.debug('Monstruos encontrados: ' + incubatingMonsters.length);

    incubatingMonsters.forEach(async (monster) => {
      // Log de depuración para registrar detalles de procesamiento
      this.logger.debug('Procesando monstruo: ' + monster.incubationTime);

      try {
        const sendedMonster$ = this.client.send<any>('create-monster', {
          name: monster.name,
          attack: monster.attack,
          defense: monster.defense,
          hp: monster.hp,
          speed: monster.speed,
          imageUrl: monster.imageUrl,
          code: monster.code,
          typeCode: monster.typeCode,
        });
        const sendedMonster = await lastValueFrom(sendedMonster$);
        console.log('sendedMonster: ' + JSON.stringify(sendedMonster));
        monster.status = 'INCUBATED';
        monster.save();
      } catch (error) {
        console.log('error: ' + JSON.stringify(error));
      }
    });
  }
}
