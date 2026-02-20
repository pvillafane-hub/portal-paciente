export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
// import { origin, rpID } from "@/config/webauthn";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("=== LOGIN FINISH ===");
    console.log("Body ID:", body.id);

    const expectedChallenge =
      cookies().get("passkey_challenge")?.value;

    if (!expectedChallenge) {
      console.log("❌ Challenge missing");
      return NextResponse.json(
        { error: "Challenge missing" },
        { status: 400 }
      );
    }

    console.log("✅ Challenge found:", expectedChallenge);

    // 🔐 USAR EL ID TAL CUAL VIENE (base64url)
    const credentialId = body.id;

    const all = await prisma.authMethod.findMany();
    console.log("DB credentialIds:", all.map(m => m.credentialId));

    const method = await prisma.authMethod.findFirst({
      where: {
        credentialId: credentialId,
      },
    });

    if (!method) {
      console.log("❌ Passkey not found in DB");
      return NextResponse.json(
        { error: "Passkey not found" },
        { status: 400 }
      );
    }

    console.log("✅ Passkey found in DB");
    
    const origin = process.env.NEXT_PUBLIC_APP_URL!;
    const rpID = new URL(origin).hostname;
    
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: method.credentialId,
        publicKey: Buffer.from(method.publicKey, "base64"),
        counter: method.counter,
      },
    });

    if (!verification.verified) {
      console.log("❌ Verification failed");
      return NextResponse.json(
        { error: "Verification failed" },
        { status: 400 }
      );
    }

    console.log("✅ Verification success");

    await prisma.authMethod.update({
      where: { id: method.id },
      data: {
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      },
    });

    console.log("✅ Counter updated");

    const response = NextResponse.json({ ok: true });

    response.cookies.set("passkey_challenge", "", {
      path: "/",
      expires: new Date(0),
    });

    console.log("=== LOGIN SUCCESS ===");

    return response;

  } catch (err) {
    console.error("🔥 LOGIN FINISH ERROR:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
