import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { rpID, origin, rpName } from "@/config/webauthn";

export async function POST(req: NextRequest) {
  try {
    const userId = cookies().get("pp_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const options = await generateRegistrationOptions({
      rpID,
      rpName,
      userID: new TextEncoder().encode(user.id), // 👈 IMPORTANTE
      userName: user.email,
      userDisplayName: user.fullName,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    const response = NextResponse.json(options);

    // 🔐 Guardamos challenge en cookie temporal
    response.cookies.set("passkey_challenge", options.challenge, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register start error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
