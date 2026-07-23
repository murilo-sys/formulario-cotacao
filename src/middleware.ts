import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
    redis: redis,
    // Regra: limite de 5 requisições em um intervalo de 10 segundos
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true
})

export async function middleware(request: NextRequest) {

    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"

    const { success } = await ratelimit.limit(ip)

    if (!success) {
        return NextResponse.json({ erro: "Você fez muitas requisições. Aguarde alguns segundos." }, { status: 429 })
    }

    return NextResponse.next()
}

export const config = {
    matcher: "api/cotacao/:path*"
}

