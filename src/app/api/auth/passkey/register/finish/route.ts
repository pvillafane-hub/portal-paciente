import { NextRequest, NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { origin, rpID } from "@/config/webauthn";

export async function POST(req: NextRequest) {
  try {
    const userId = cookies().get("pp_session")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Register finish error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
