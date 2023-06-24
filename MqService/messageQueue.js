const amqp = require('amqplib');
const { queueConfigs } = require('./queueConfig')

class MessageQueueService {
	constructor(CONN_URL) {
		this.connection_url = CONN_URL;
	}

	async connect() {
		const connection = await amqp.connect(this.connection_url);
		this.channel = await connection.createChannel();
	}
	
	async assertQueue(queueName) {
		await this.channel.assertQueue(queueName, {durable: true});
	}

	async publishToQueue(queueName, data) {
		await this.channel.assertQueue(queueName);
		this.channel.sendToQueue(queueName, Buffer.from(data));
	}

	async enqueue(topic, payload) {
		const config = queueConfigs.find(item => item.type === topic);
		const {queue, handler} = config;
		if(!queue || ! handler) {
			return null
		}
		const assertQueue = await this.channel.assertQueue(queue, {durable: true});
		console.log('assertQueue--------', assertQueue)
		await this.publishToQueue(queue, Buffer.from(JSON.stringify({...payload, handler})))
	}
	
	async dequeue() {
		this.channel.consume(process.env.APP_ROLE, data => {
			console.log(`Received ${Buffer.from(data.content)}`)
			this.channel.ack(data)
			const payload = JSON.parse(data.content);
			const { handler } = payload;
			const [controllerName, callbackFn] = handler.split('.')
			console.log('controllerName--------', controllerName);
			console.log('callBackFn-------', callbackFn);
			const controller = require(`../api/controllers/${controllerName}`)
			controller[callbackFn](payload);
		})
	}

	closeChannel() {
		this.channel.close();
		console.log(`Closing rabbitmq channel`);
	}
}

module.exports = MessageQueueService;