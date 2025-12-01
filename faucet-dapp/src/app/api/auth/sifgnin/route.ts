import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { SiweMessage } from "siwe";
import { saveSiweSession } from "@/lib/siweStore";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "address requerido" },
        { status: 400 }
      );
    }

    const nonce = randomBytes(16).toString("hex");
    const token = randomBytes(16).toString("hex");

    const siwe = new SiweMessage({
      domain: new URL(APP_URL).host,
      address,
      statement: "Sign in to Faucet dApp",
      uri: APP_URL,
      version: "1",
      chainId: 11155111,
      nonce,
    });

    const message = siwe.prepareMessage();

    saveSiweSession({
      token,
      address,
      message,
      nonce,
    });

    // Para el ejercicio, devolvemos también el message
    return NextResponse.json({ token, address, message });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error generando mensaje SIWE" },
      { status: 500 }
    );
  }
}
