import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/better-auth";

/**
 * Proxy (Next 16, ex-"middleware"). Protege /admin/*; fora de /admin não faz
 * nada (matcher abaixo). Next 16 roda Proxy em runtime Node.js por padrão,
 * então dá pra validar a sessão do Better Auth direto no banco aqui (sem
 * truque de cookie "leve" que o Edge runtime exigiria).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  // Submit de um <form>/useActionState do admin (saveVehicle, deleteVehicle,
  // updateSiteConfig, ...) chega aqui como POST com o header "next-action".
  // Essas actions já chamam requireUser() sozinhas. Rodar getSession() de
  // novo aqui no proxy pra essas requisições causa dois problemas:
  // 1) Um redirect cru do proxy quebra o protocolo de Server Actions no
  //    cliente ("An unexpected response was received from the server") em
  //    vez de simplesmente navegar pro login.
  // 2) Duas leituras de sessão quase simultâneas pra mesma request podem
  //    conflitar com a renovação de sessão do Better Auth.
  // Deixa passar sem tocar em cookie/sessão; quem decide é a própria action.
  if (isServerActionRequest(request)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session && !isLogin) {
    const redirect = new URL("/admin/login", request.url);
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

function isServerActionRequest(request: NextRequest) {
  return request.method === "POST" && request.headers.has("next-action");
}

export const config = {
  matcher: ["/admin/:path*"],
};
