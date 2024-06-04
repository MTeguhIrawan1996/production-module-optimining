import { sendGAEvent as sendGAEventGoogle } from '@next/third-parties/google';

type EventParams = {
  event: 'Tambah' | 'Edit' | 'Filter' | 'Unduh';
  params: {
    category: string;
    subCategory: string;
    subSubCategory: string;
    account: string;
  };
};

export const sendGAEvent = (eventParams: EventParams) => {
  try {
    sendGAEventGoogle('event', eventParams.event, eventParams.params);
  } catch {
    sendGAEventGoogle('event', eventParams.event, eventParams.params);
  }
};
