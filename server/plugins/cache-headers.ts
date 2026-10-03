/**
 * Cache-Control for successfully rendered pages.
 *
 * Browsers honour max-age right away. Cloudflare's edge only caches HTML once a Cache Rule
 * marks it as eligible for this zone (see README); then s-maxage lets repeat page views be
 * served without running the Pages Function at all.
 *
 * Done here rather than with a `headers` route rule on `/**` because Nitro would also write
 * such a rule into the Pages `_headers` file, shortening the cache lifetime of every static
 * file in `public/`.
 */
const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400';

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:response', (response) => {
        if ((response.statusCode ?? 200) === 200) {
            response.headers['cache-control'] = CACHE_CONTROL;
        }
    });
});
