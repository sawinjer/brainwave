import { Kafka } from "kafkajs";
import { env } from "../env";
import { KafkaTopics } from "./topics";

export const kafka = new Kafka({
  clientId: "brainwave-server",
  brokers: env.KAFKA_BROKERS.split(","),
});

const producer = kafka.producer();
const consumer = kafka.consumer({
  groupId: `game-server-${process.env.SERVER_ID ?? crypto.randomUUID()}`,
});

let producerIsConnected = false;
let consumerIsConnected = false;
let topicsCreated = false;

const ensureTopics = async () => {
  if (topicsCreated) return;
  const admin = kafka.admin();
  await admin.connect();
  try {
    await admin.createTopics({
      topics: Object.values(KafkaTopics).map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
  } finally {
    await admin.disconnect();
  }
  topicsCreated = true;
};

export const getProducer = async () => {
  if (!producerIsConnected) {
    await ensureTopics();
    await producer.connect();
    producerIsConnected = true;
  }

  return producer;
};

export const getConsumer = async () => {
  if (!consumerIsConnected) {
    await ensureTopics();
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
