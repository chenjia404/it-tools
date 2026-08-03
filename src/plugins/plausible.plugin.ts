import type { App } from 'vue';
import { init, track } from '@plausible-analytics/tracker';
import { config } from '@/config';

export interface PlausibleClient {
  trackEvent: (eventName: string) => void;
}

function createFakePlausibleInstance(): PlausibleClient {
  return {
    trackEvent: () => {},
  };
}

function buildEndpoint(apiHost: string) {
  const normalizedHost = apiHost.replace(/\/$/, '');
  return normalizedHost.endsWith('/api/event')
    ? normalizedHost
    : `${normalizedHost}/api/event`;
}

function createPlausibleInstance({
  config: plausibleConfig,
}: {
  config: {
    isTrackerEnabled: boolean;
    domain: string;
    apiHost: string;
    trackLocalhost: boolean;
  };
}): PlausibleClient {
  if (!plausibleConfig.isTrackerEnabled) {
    return createFakePlausibleInstance();
  }

  init({
    domain: plausibleConfig.domain,
    ...(plausibleConfig.apiHost ? { endpoint: buildEndpoint(plausibleConfig.apiHost) } : {}),
    captureOnLocalhost: plausibleConfig.trackLocalhost,
    autoCapturePageviews: true,
  });

  return {
    trackEvent: (eventName: string) => track(eventName, {}),
  };
}

export const plausible = {
  install: (app: App) => {
    const plausibleClient = createPlausibleInstance({ config: config.plausible });
    app.provide('plausible', plausibleClient);
  },
};
