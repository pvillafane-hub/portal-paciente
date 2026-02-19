import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { origin, rpID } from "@/config/webauthn";

export async function POST(req: NextRequest) {
  try {
    console.log("=== REGISTER FINISH HIT ===");

    const challenge = cookies().get("passkey_challenge")?.value;

    if (!challenge) {
      console.log("❌ Challenge missing");
      return NextResponse.json(
        { error: "Challenge missing" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      console.log("❌ Registration verification failed");
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    const { credential } = verification.registrationInfo;

    const credentialIdBase64 = credential.id;

    const publicKeyBase64 =
      Buffer.from(credential.publicKey).toString("base64");

    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!user) {
      console.log("❌ No user found");
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    console.log("✅ Saving credential to DB:", credentialIdBase64);

    await prisma.authMethod.create({
      data: {
        userId: user.id,
        type: "passkey",
        credentialId: credentialIdBase64,
        publicKey: publicKeyBase64,
        counter: credential.counter,
      },
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.delete("passkey_challenge");

    console.log("✅ Registration saved successfully");

    return response;

  } catch (err) {
    console.error("🔥 REGISTER FINISH ERROR:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
