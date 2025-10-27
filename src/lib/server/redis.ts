import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { UPSTASH_REDIS_REST_TOKEN } from "$env/static/private";
import { UPSTASH_REDIS_REST_URL } from "$env/static/private";

export const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
});

export const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
});
