/* /app/login/page.tsx */
// Combina la UI de Supabase para OAuth y un formulario para Server Actions.
"use client";

import { login, signup } from "./actions";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000/";
    url = url.includes("http") ? url : `https://${url}`;
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
    return `${url}auth/callback`;
  };

  return (
    <div>
      {/* Formulario para Email/Contraseña con Server Actions */}
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>

      {/* Divisor */}
      <div style={{ margin: "2rem 0", textAlign: "center" }}>o</div>

      {/* UI para proveedores OAuth (Google) */}
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]}
        redirectTo={getURL()}
        onlyThirdPartyProviders
      />
    </div>
  );
}
