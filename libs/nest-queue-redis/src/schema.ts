import { JSONSchemaType } from 'ajv';

export interface Options {
  host: string;
  port: number;
  database: number;
  queue: string;
  url: string;
}

export const schema = {
  type: 'object',
  properties: {
    host: { type: 'string', nullable: true },
    port: { type: 'number', nullable: true },
    database: { type: 'number', nullable: true },
    queue: { type: 'string', nullable: true },
    url: { type: 'string', nullable: true },
  },
  required: ['host', 'port', 'database', 'queue'],
  additionalProperties: true,
};
