import { HasuraModule } from "@golevelup/nestjs-hasura";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HouseModule } from "./house/house.module";
import { PaymentModule } from "./payment/payment.module";
import { UserService } from "./user/user.service";

const path = require("node:path");

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentModule,
    HouseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    HasuraModule.forRootAsync(HasuraModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const webhookSecret = configService.get<string>(
          "API_EVENT_WEBHOOK_SHARED_SECRET",
        );

        const environment = configService.get<string | undefined>("NODE_ENV");

        return {
          webhookConfig: {
            secretFactory: webhookSecret,
            secretHeader: "nestjs-event-webhook",
          },
          managedMetaDataConfig:
            environment === undefined || environment === "development"
              ? {
                  metadataVersion: "v3",
                  dirPath: path.join(process.cwd(), "hasura/metadata"),
                  nestEndpointEnvName: "API_EVENT_WEBHOOK_ENDPOINT",
                  secretHeaderEnvName: "API_EVENT_WEBHOOK_SHARED_SECRET",
                  defaultEventRetryConfig: {
                    numRetries: 3,
                    timeoutInSeconds: 100,
                    intervalInSeconds: 30,
                    toleranceSeconds: 21600,
                  },
                }
              : undefined,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
