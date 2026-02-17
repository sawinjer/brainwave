import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
	clientId: 'brainwave-server',
	brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'game-servers' });

let producerIsConnected = false;
let consumerIsConnected = false;

export const getProducer = async () => {
	if (!producerIsConnected) {
		await producer.connect();
		producerIsConnected = true;
	}

	return producer;
};

export const getConsumer = async () => {
	if (!consumerIsConnected) {
		await consumer.connect();
		consumerIsConnected = true;
	}

	return consumer;
};

export const disconnectProducer = async () => {
	if (producerIsConnected) {
		await producer.disconnect();
	}
};

export const disconnectConsumer = async () => {
	if (consumerIsConnected) {
		await consumer.stop();
		await consumer.disconnect();
	}
};
