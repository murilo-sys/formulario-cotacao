import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv();

const ratelimitPadrao = new Ratelimit({
  redis: redis,
  // Regra: limite de 1 requisição em um intervalo de 15 segundos
  limiter: Ratelimit.slidingWindow(1, "15 s"),
  analytics: true
});

const ratelimitConsultarDoc = new Ratelimit({
  redis: redis,
  // Regra: limite de 2 requisições em um intervalo de 15 segundos
  limiter: Ratelimit.slidingWindow(2, "15 s"),
  analytics: true
});

export async function proxy(request: NextRequest) {
  //Pega os heardes da requisição
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // Guarda em uma constante valor booleano se é valido ou não
  const ehValido = (origin && origin.includes(host || "")) || (referer && referer.includes(host || ""));

  // Valida se é valido e retorna caso não seja 403
  if (!ehValido) return NextResponse.json({ message: "" }, { status: 403 });

  //Pega o ip de quem fez a REQ
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  //Pega o caminho da REQ
  const path = request.nextUrl.pathname;

  console.log(path);

  //Concatena os ip e o caminho
  const identifier = `${ip}:${path}`;

  const limiter = path.includes("/api/consultar-doc") ? ratelimitConsultarDoc : ratelimitPadrao;

  //Faz a verificação do ratelimit
  const { success } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json({ erro: "Você fez muitas requisições. Aguarde alguns segundos." }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
};
