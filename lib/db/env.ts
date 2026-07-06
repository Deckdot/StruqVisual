import { config as loadEnv } from 'dotenv';

/**
 * Shared env bootstrap for standalone DB scripts (migrate / import / seed /
 * assert) run via `tsx` outside Next. In the Next runtime these vars are
 * already injected, so re-loading .env.local here is a harmless no-op that
 * never overrides an existing value. Import this first in every db script.
 */
loadEnv({ path: '.env.local' });
loadEnv();
