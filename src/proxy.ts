import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured, getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Proxy (Next 16, ex-"middleware"). Protege /admin/*; fora de /admin não faz
 * nada (matcher abaixo). Também renova a sessão do Supabase a cada request.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  // Submit de um <form>/useActionState do admin (saveVehicle, deleteVehicle,
  // updateSiteConfig, ...) chega aqui como POST com o header "next-action".
  // Essas actions já chamam requireUser() sozinhas. Rodar getUser() de novo
  // aqui no proxy pra essas requisições causa dois problemas:
  // 1) Um redirect cru do proxy quebra o protocolo de Server Actions no
  //    cliente ("An unexpected response was received from the server") em
  //    vez de simplesmente navegar pro login.
  // 2) getUser() pode renovar o token; com refresh token rotativo, chamar
  //    getUser() aqui E de novo dentro da action (duas renovações quase
  //    simultâneas para a mesma request) faz a segunda invalidar a sessão
  //    que a primeira acabou de renovar - reproduzido: a sessão caía no meio
  //    do "criar veículo" mesmo logo após o login.
  // Deixa passar sem tocar em cookie/sessão; quem decide é a própria action.
  if (isServerActionRequest(request)) {
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    // Sem Supabase Auth configurado: deixa só a tela de login (que avisa),
    // qualquer outra rota /admin volta para lá.
    return isLogin
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const redirect = new URL("/admin/login", request.url);
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

function isServerActionRequest(request: NextRequest) {
  return request.method === "POST" && request.headers.has("next-action");
}

export const config = {
  matcher: ["/admin/:path*"],
};
