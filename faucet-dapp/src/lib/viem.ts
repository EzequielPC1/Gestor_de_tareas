import { createPublicClient, createWalletClient, http, getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { FAUCET_ABI } from "@/config/faucetAbi";

const RPC_URL = process.env.RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY!}`);

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC_URL),
  account,
});

export const faucetContract = getContract({
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: FAUCET_ABI,
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});
