import { sendGAEvent as sendGAEventGoogle } from '@next/third-parties/google';

type EventParams = {
  event: string;
  params: {
    category: string;
    subEvent: string;
    account: string;
  };
};

export const sendGAEvent = (eventParams: EventParams) => {
  sendGAEventGoogle('event', eventParams.event, eventParams.params);
};
