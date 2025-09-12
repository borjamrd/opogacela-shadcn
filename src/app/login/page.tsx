"use client";

import { login, signup } from "./actions";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import React from "react";

export default function LoginPage() {
  const supabase = createClient();

  const [showPassword, setShowPassword] = React.useState(false);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
          <CardDescription>Accede para ver tus cursos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? (
                <EyeOff size={20} />
                ) : (
                <Eye size={20} />
                )}
              </button>
              </div>
            </div>
            <div className="grid w-full gap-2">
              <Button formAction={login}>Iniciar sesión</Button>
              <Button formAction={signup} variant="secondary">
                Crear cuenta
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Separator className="my-4" />
          <div className="text-center text-sm text-muted-foreground">
            O continúa con
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            redirectTo={getURL()}
            onlyThirdPartyProviders
          />
        </CardFooter>
      </Card>
    </div>
  );
}
