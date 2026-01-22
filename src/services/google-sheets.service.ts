import { google } from 'googleapis';

export class GoogleSheetsService {
    private auth;
    private spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID;

    constructor() {
        this.auth = new google.auth.GoogleAuth({
            credentials: {
                type: 'service_account',
                project_id: 'opogacela',
                private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
                client_email: process.env.CLIENT_GOOGLE_EMAIL,
                client_id: '115968510702393221802',
                universe_domain: 'googleapis.com',
            },
            scopes: 'https://www.googleapis.com/auth/spreadsheets',
        });
    }

    async saveOrder(
        date: Date,
        name: string,
        surname: string,
        line1: string | null | undefined,
        line2: string | null | undefined,
        cp: string | null | undefined,
        state: string | null | undefined,
        email: string,
        phone: string,
        totalPrice: number | null,
        idProduct: string | null | undefined
    ) {
        try {
            const client: any = await this.auth.getClient();
            const googleSheets = google.sheets({ version: 'v4', auth: client });

            const getRows = await googleSheets.spreadsheets.values.get({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: 'A:L',
            });

            const numRows = getRows.data.values ? getRows.data.values.length : 0;
            const range = `A${numRows + 1}:L${numRows + 1}`;

            await googleSheets.spreadsheets.values.append({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [
                        [
                            date,
                            name,
                            surname,
                            line1,
                            line2,
                            cp,
                            state,
                            email,
                            phone,
                            totalPrice,
                            idProduct,
                        ],
                    ],
                },
            });
        } catch (error) {
            console.error('Problemas al guardar los datos en Google Sheets', error);
            throw error; // Re-throw to let the caller decide how to handle it or just log it there if we want to suppress it in the main flow.
            // In the original code it just logged error. keeping it void but maybe throwing is better for higher level handling.
            // For now I will leave it as void but logging, consistent with original behavior allowing the flow to continue.
        }
    }
}
