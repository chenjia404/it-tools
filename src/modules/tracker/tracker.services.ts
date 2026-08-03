import type { PlausibleClient } from '@/plugins/plausible.plugin';
import _ from 'lodash';
import { inject } from 'vue';

export { createTrackerService, useTracker };

function createTrackerService({ plausible }: { plausible: PlausibleClient }) {
  return {
    trackEvent({ eventName }: { eventName: string }) {
      plausible.trackEvent(eventName);
    },
  };
}

function useTracker() {
  const plausible: PlausibleClient | undefined = inject('plausible');

  if (_.isNil(plausible)) {
    throw new TypeError('Plausible must be instantiated');
  }

  const tracker = createTrackerService({ plausible });

  return {
    tracker,
  };
}
