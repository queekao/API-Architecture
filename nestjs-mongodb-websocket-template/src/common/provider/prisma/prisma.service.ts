import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConditionalKeys, Except } from 'type-fest';

// middleware https://www.prisma.io/docs/concepts/components/prisma-client/middleware

type ExtractNonArgsSelect<T> = Pick<T, ConditionalKeys<T, boolean | undefined>>;
type ExtractArgsSelect<T> = Omit<T, keyof ExtractNonArgsSelect<T>>;
type NonKeyofPick<T, K> = Pick<T, keyof { [TK in keyof T as TK extends K ? TK : never]: T[TK] }>;
type ArgsSelectApplyPrismaSelectFromClass<A, C> = Omit<A, 'select'> & {
  [K in keyof A as K extends 'select' ? K : never]-?: PrismaSelectFromClass<
    Exclude<A[K], null | undefined | boolean>,
    C extends Array<any> ? C[0] : C
  >;
};

/** 注意，會忽略 Select 中不存在的屬性，請務必再使用 dtoCheck 確認型態正確 */
export type PrismaSelectFromClass<T, C> = Required<NonKeyofPick<ExtractNonArgsSelect<T>, keyof C>> & {
  [K in keyof NonKeyofPick<ExtractArgsSelect<T>, keyof C>]-?: K extends keyof C
    ? ArgsSelectApplyPrismaSelectFromClass<Exclude<T[K], null | boolean | undefined>, Exclude<C[K], null | undefined>>
    : never;
};
export type PrismaSelect<T, K extends keyof T, O extends K = never> = Required<Pick<T, Exclude<K, O>>>;

export type PrismaServiceTransactionClient = Except<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable()
export class PrismaService
  extends PrismaClient<{
    // log: [{ emit: 'event'; level: 'query' }];
  }>
  implements OnModuleInit
{
  private readonly logger = new Logger('PrismaService');
  constructor() {
    super({
      // log: [{ emit: 'event', level: 'query' }],
    });

    this.$use(this.logMiddleware.bind(this));
    // this.$on('query', (e) => {
    //   this.logger.verbose(`${e.query};  << ${e.params} - ${e.duration}`);
    // });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connect to Database succeed!');
    await this.seed();
  }

  async seed() {}

  // middleware
  private async logMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ) {
    const result = await next(params);
    if (params.action === 'create' || params.action === 'createMany') {
      this.logger.verbose(
        `${params.action} ${params.model}: `,
        JSON.stringify(this.removeSensitiveData(params.model, params.args?.data)),
      );
    }

    if (params.action === 'update') {
      this.logger.verbose(
        `${params.action} ${params.model}: `,
        JSON.stringify({
          where: params.args?.where,
          data: this.removeSensitiveData(params.model, params.args?.data),
        }),
      );
    }

    if (params.action === 'upsert') {
      this.logger.verbose(
        `${params.action} ${params.model}: `,
        JSON.stringify({
          where: params.args?.where,
          create: this.removeSensitiveData(params.model, params.args?.create),
          update: this.removeSensitiveData(params.model, params.args?.update),
          include: params.args.include,
        }),
      );
    }

    if (params.action === 'updateMany') {
      this.logger.verbose(
        `${params.action} ${params.model}: `,
        JSON.stringify({
          where: params.args?.where,
          data: this.removeSensitiveData(params.model, params.args?.data),
        }),
      );
    }

    if (params.action === 'delete') {
      this.logger.verbose(
        `${params.action} ${params.model}: `,
        JSON.stringify({
          where: params.args?.where,
          include: params.args?.include,
        }),
      );
    }

    if (params.action === 'deleteMany') {
      this.logger.verbose(`${params.action} ${params.model}: `, JSON.stringify({ where: params.args?.where }));
    }

    return result;
  }

  private removeSensitiveData(modelsName: Prisma.ModelName | undefined, data: any | Array<any>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hiddenText = '<HIDDEN>';

    if (Array.isArray(data) === true) {
      return data.map((value: any) => {
        return this.removeSensitiveData(modelsName, value);
      });
    }

    return data;
  }
}
