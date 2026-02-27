import type { NextApiRequest, NextApiResponse } from "next";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rpID =
  process.env.NODE_ENV === "production"
    ? "portal-paciente-orpin.vercel.app"
    : "localhost";

const origin =
  process.env.NODE_ENV === "production"
    ? "https://portal-paciente-orpin.vercel.app"
    : "http://localhost:3000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    const expectedChallenge = req.cookies.passkey_challenge;
    const userId = req.cookies.user_id;

    if (!expectedChallenge || !userId) {
      return res.status(400).json({ error: "Missing challenge or user" });
    }

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ error: "Verification failed" });
    }

    const { credential } = verification.registrationInfo;

    await prisma.authMethod.create({
      data: {
        userId,
        type: "passkey",
        credentialId: Buffer.from(credential.id).toString("base64"),
        publicKey: Buffer.from(credential.publicKey).toString("base64"),
        counter: credential.counter,
      },
    });

    return res.status(200).json({ verified: true });
  } catch (error) {
    console.error("Register Finish Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}