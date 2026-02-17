import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { origin, rpID } from "@/config/webauthn";

export async function POST(req: NextRequest) {
  try {
    const userId = cookies().get("pp_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔐 Leer challenge desde cookie
    const challenge = cookies().get("passkey_challenge")?.value;

    if (!challenge) {
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
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
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

    // 🧹 Borrar challenge
    const response = NextResponse.json({ ok: true });
    response.cookies.delete("passkey_challenge");

    return response;

  } catch (err) {
    console.error("Register finish error:", err);

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
