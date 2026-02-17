import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { rpID, rpName } from "@/config/webauthn";
import { passkeyChallenges } from "@/lib/passkey.challenge.store";

export async function POST(req: NextRequest) {
  try {
    const userId = cookies().get("pp_session")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔐 userID ahora debe ser Uint8Array
    const userID = new TextEncoder().encode(user.id);

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID,
      userName: user.email,
      userDisplayName: user.fullName,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    // ✅ GUARDAMOS EL CHALLENGE
    passkeyChallenges.set(user.id, options.challenge);

    return NextResponse.json(options);
  } catch (err) {
    console.error("Register start error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
