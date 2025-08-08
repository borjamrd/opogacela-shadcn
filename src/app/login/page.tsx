// /app/login/page.tsx
"use client";
import { supabase } from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
return (
    <div className="flex items-center justify-center h-screen">
        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]} // Puedes añadir más proveedores
        />
    </div>
);
}
