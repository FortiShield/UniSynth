import type { RequestHandler } from '@khulnasoft.com/unisynth-city';

export const onGet: RequestHandler = async (requestEvent) => {
  const response = new Response('Hello World', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
  requestEvent.send(response);
};
