import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { origin, rpID } from "@/config/webauthn";
import { passkeyChallenges } from "@/lib/passkey.challenge.store";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const userId = cookies().get("pp_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const expectedChallenge = passkeyChallenges.get(userId);

  if (!expectedChallenge) {
    return NextResponse.json({ error: "Challenge missing" }, { status: 400 });
  }

  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const { credentialID, credentialPublicKey, counter } =
    verification.registrationInfo;

  await prisma.authMethod.create({
    data: {
      userId,
      type: "passkey",
      credentialId: Buffer.from(credentialID).toString("base64"),
      publicKey: Buffer.from(credentialPublicKey).toString("base64"),
      counter,
    },
  });

  passkeyChallenges.delete(userId);

  return NextResponse.json({ ok: true });
}
