namespace NodeJS {
    interface ProcessEnv {
        STRIPE_SECRET_KEY: string;
        BASE_URL: string;
        NEXT_PUBLIC_URL: string;
        WEBHOOK_SECRET: string;
        RESEND_API_KEY: string;
        GOOGLE_SHEET_SPREADSHEET_ID: string;
        GOOGLE_PRIVATE_KEY_ID: string;
        CLIENT_GOOGLE_EMAIL: string;
        GOOGLE_PRIVATE_KEY: string;
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}
