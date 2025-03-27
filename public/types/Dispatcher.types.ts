export type Action<Payload = unknown> = {
  type: string;
  payload?: Payload;
};
