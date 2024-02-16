import WithProviders from '@/components/exposes/WithProviders';

import * as Pages from '../features'; // Assuming all pages are in this directory

export const WeeklyPlanPage = () => (
  <WithProviders>
    <Pages.WeeklyPlanPage />
  </WithProviders>
);

export const CreateWeeklyPlanInformationPage = () => (
  <WithProviders>
    <Pages.CreateWeeklyPlanInformationPage />
  </WithProviders>
);

export const CreateWeeklyPlanGroupPage = () => (
  <WithProviders>
    <Pages.CreateWeeklyPlanGroupPage />
  </WithProviders>
);

export const ReadWeeklyPlanGroupPage = () => (
  <WithProviders>
    <Pages.ReadWeeklyPlanGroupPage />
  </WithProviders>
);

export const ReadWeeklyPlanInformationPage = () => (
  <WithProviders>
    <Pages.ReadWeeklyPlanInformationPage />
  </WithProviders>
);

export const ReadWeeklyPlanPage = () => (
  <WithProviders>
    <Pages.ReadWeeklyPlanPage />
  </WithProviders>
);

export const UpdateWeeklyPlanGroupPage = () => (
  <WithProviders>
    <Pages.UpdateWeeklyPlanGroupPage />
  </WithProviders>
);

export const UpdateWeeklyPlanInformationPage = () => (
  <WithProviders>
    <Pages.UpdateWeeklyPlanInformationPage />
  </WithProviders>
);

export const UpdateWeeklyPlanPage = () => (
  <WithProviders>
    <Pages.UpdateWeeklyPlanPage />
  </WithProviders>
);
