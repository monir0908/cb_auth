import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  default as amqp,
} from 'amqp-connection-manager';
import { ConfirmChannel, Connection } from 'amqplib';
import { AuthQueueService } from './definitions/auth.command.abstract.service';

@Injectable()
export class RMQAuthService extends AuthQueueService {
  private connectionManager: AmqpConnectionManager;
  private publisherChannelWrapper: ChannelWrapper;
  private connectionRetryDelay = 10;
  private channelExchange: string;
  private fanoutExchange: string;

  constructor(private readonly confSvc: ConfigService) {
    super();
    Logger.log(`Rabbitmq url ${this.confSvc.get('rabbitmq.url')}`);
    this.connectionManager = amqp.connect([this.confSvc.get('rabbitmq.url')], {
      reconnectTimeInSeconds: this.connectionRetryDelay,
      connectionOptions: {
        keepAlive: true,
      },
    });
    this.connectionManager.on('connect', this.onConnection);
    this.connectionManager.on('disconnect', this.onDisconnection.bind(this));
    this.channelExchange = 'auth.event.exchange';
    this.fanoutExchange = 'auth.fanout.exchange';
    this.setUpDirectExchangePublisher();
    this.setUpFanoutExchangePublisher();
  }

  isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

  onConnection(connection: Connection) {
    console.log(connection.url);
    Logger.log(
      `Rabbitmq connection established. url: ${connection.url}`,
      `RMQAuthService`,
    );
  }

  onDisconnection(error: Error) {
    console.log(error);
    Logger.error(error.message, error.stack, 'RMQAuthService');
    Logger.log('Rabbitmq disconnected!', 'RMQAuthService');
    Logger.log(
      `Retrying connnection in ${this.connectionRetryDelay} second(s)`,
      'RMQAuthService',
    );
  }

  setUpDirectExchangePublisher() {
    this.publisherChannelWrapper = this.connectionManager.createChannel({
      json: true,
      setup: (channel: ConfirmChannel) => {
        channel.assertExchange(this.channelExchange, 'direct', {
          durable: true,
        });
      },
    });
  }

  setUpFanoutExchangePublisher() {
    this.publisherChannelWrapper = this.connectionManager.createChannel({
      json: true,
      setup: (channel: ConfirmChannel) => {
        channel.assertExchange(this.fanoutExchange, 'fanout', {
          durable: true,
        });
      },
    });
  }

  async publishAuthEvents(_event: string, msg: any, type = 'direct') {
    const routingKey = _event;
    const exchange =
      type === 'direct' ? this.channelExchange : this.fanoutExchange;
    return this.publisherChannelWrapper.publish(exchange, routingKey, msg, {
      persistent: true,
      contentType: 'application/json',
    });
  }
}
