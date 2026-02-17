import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { origin, rpID } from "@/config/webauthn";
import { passkeyChallenges } from "@/lib/passkey.challenge.store";
import { cookies } from "next/headers";
import { setSession } from "@/lib/auth";

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

  const method = await prisma.authMethod.findFirst({
    where: { userId, type: "passkey" },
  });

  if (!method) {
    return NextResponse.json({ error: "Passkey not found" }, { status: 400 });
  }

  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: Buffer.from(method.credentialId, "base64"),
      publicKey: Buffer.from(method.publicKey, "base64"),
      counter: method.counter,
    },
  });

  if (!verification.verified) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }

  await prisma.authMethod.update({
    where: { id: method.id },
    data: {
      counter: verification.authenticationInfo.newCounter,
      lastUsedAt: new Date(),
    },
  });

  setSession(userId);

  passkeyChallenges.delete(userId);

  return NextResponse.json({ ok: true });
}
