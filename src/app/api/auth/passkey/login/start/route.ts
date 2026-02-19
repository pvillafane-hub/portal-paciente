import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { rpID } from "@/config/webauthn";

export async function POST() {
  try {
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });

    const response = NextResponse.json(options);

    response.cookies.set("passkey_challenge", options.challenge, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (err) {
    console.error("🔥 Login start error:", err);

    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
