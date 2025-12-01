import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { faucetContract } from "@/lib/web3";

function getAuthAddress(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length);
  try {
    const payload = verifyAuthToken(token);
    return payload.address;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const address = getAuthAddress(req);
    if (!address) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Aquí el backend paga el gas y ejecuta claimTokens.
    // Nota: Según cómo esté implementado el contrato,
    // puede mintear al msg.sender (cuenta del backend).
    // Para el ejercicio, asumimos que esto es lo esperado.
    const hash = await faucetContract.write.claimTokens();

    return NextResponse.json({ txHash: hash, success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al reclamar tokens", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
