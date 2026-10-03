/**
 * Payload extraction is disabled (see routeRules in nuxt.config.ts), so there is no
 * `/_payload.json` endpoint any more. HTML that browsers and crawlers cached from the
 * previous build still asks for it; answer with a cheap, cacheable 410 instead of
 * letting the request fall through to a full page render.
 */
export default defineEventHandler((event) => {
    if (getRequestURL(event).pathname.endsWith('/_payload.json')) {
        setResponseStatus(event, 410);
        setResponseHeader(event, 'cache-control', 'public, max-age=86400');
        return '';
    }
});
