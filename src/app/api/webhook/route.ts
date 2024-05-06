import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { Resend } from "resend";
import { ShippingDetails } from "@/components/email/shippingDetails";
import { ShippingAdminDetails } from "@/components/email/shippingAdmin";
import { google } from "googleapis";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const headersList = headers();
  const sig: string = headersList.get("stripe-signature") || "";

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  let eventId;
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 400 });
  }

  if (event.id === eventId) {
    return NextResponse.json({ msg: "Evento ya creado" }, { status: 400 });
  } else {
    eventId = event.id;
  }
  switch (event.type) {
    case "checkout.session.completed":
      //TODO change default fields with better options such custom fields with customername
      const checkoutSessionCompleted = event.data.object;
      const customerAddress: any =
        checkoutSessionCompleted.customer_details?.address || "not found";
      const customerEmail =
        checkoutSessionCompleted.customer_email ||
        checkoutSessionCompleted.customer_details?.email ||
        "not found";
      const customerName =
        checkoutSessionCompleted.customer_details?.name || "not found";
      const resend = new Resend(process.env.RESEND_API_KEY);

      try {
        await saveDataToGoogleSheets(
          new Date(event.created * 1000),
          customerName,
          customerName,
          customerAddress?.line1,
          customerAddress?.line2,
          customerAddress.postal_code,
          customerAddress.state,
          customerEmail,
          event.id
        );
      } catch (error) {
        console.error("Problemas al guardar los datos en Google Sheets", error);
      }

      try {
        await resend.emails.send({
          from: "Compras Opogacela <compras@opogacela.es>",
          to: [customerEmail],
          subject: "Compra realizada con éxito",
          react: ShippingDetails({
            name: customerName,
            email: customerEmail,
            address: customerAddress,
          }) as React.ReactElement,
        });

        await resend.emails.send({
          from: "Compras Opogacela <compras@opogacela.es>",
          to: [
            "pilar.soldado@gmail.com",
            "borjamrd1@gmail.com",
          ],
          subject: "Nueva compra en OPOGACELA",
          react: ShippingAdminDetails({
            name: customerName,
            email: customerEmail,
            address: customerAddress,
          }) as React.ReactElement,
        });
      } catch (error) {
        return Response.json({ error });
      }

      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
      break;
  }

  async function saveDataToGoogleSheets(
    date: any,
    name: string,
    surname: string,
    line1: Stripe.Address | undefined | null,
    line2: Stripe.Address | undefined | null,
    cp: any,
    state: any,
    email: string,
    idProduct: any
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: "opogacela",
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join(
          "\n"
        ),
        client_email: process.env.CLIENT_GOOGLE_EMAIL,
        client_id: "115968510702393221802",

        universe_domain: "googleapis.com",
      },
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client: any = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = process.env.GOOGLE_SHEET_SPREADSHEET_ID;

    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "A:L",
    });

    const numRows = getRows.data.values ? getRows.data.values.length : 0;

    // Calcular el rango dinámico para la nueva fila
    const range = `A${numRows + 1}:L${numRows + 1}`;

    // Añadir una nueva fila con los datos proporcionados
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [date, name, surname, line1, line2, cp, state, email, idProduct],
        ],
      },
    });
  }

  return NextResponse.json({ event }, { status: 200 });
}
