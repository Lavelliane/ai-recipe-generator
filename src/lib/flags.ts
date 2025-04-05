import { flag } from 'flags/next';
 
export const unsplashFetch = flag({
  key: 'unsplash-fetch',
  decide() {
    return false;
  },
});