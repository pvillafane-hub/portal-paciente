import type { NextApiRequest, NextApiResponse } from "next";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rpName = "Portal del Paciente";
const rpID =
  process.env.NODE_ENV === "production"
    ? "portal-paciente-orpin.vercel.app"
    : "localhost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.cookies.user_id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { AuthMethod: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user.id), // ✅ FIX
      userName: user.email,
      attestationType: "none",
      excludeCredentials: user.AuthMethod.map((method) => ({
        id: method.credentialId,
        type: "public-key",
      })),
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "preferred",
      },
    });

    res.setHeader(
      "Set-Cookie",
      `passkey_challenge=${options.challenge}; HttpOnly; Path=/; SameSite=Lax`
    );

    return res.status(200).json(options);
  } catch (error) {
    console.error("Register Start Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}