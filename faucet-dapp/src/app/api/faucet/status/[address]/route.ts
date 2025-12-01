import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/jwt";
import { faucetContract } from "@/lib/web3";

function isAuthValid(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice("Bearer ".length);
  try {
    verifyAuthToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    if (!isAuthValid(req)) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const address = params.address as `0x${string}`;

    const [hasClaimed, balance, users, amount] = await Promise.all([
      faucetContract.read.hasAddressClaimed([address]),
      faucetContract.read.balanceOf([address]),
      faucetContract.read.getFaucetUsers(),
      faucetContract.read.getFaucetAmount(),
    ]);

    return NextResponse.json({
      hasClaimed,
      balance: balance.toString(),
      users,
      amount: amount.toString(),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Error al obtener estado del faucet", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
