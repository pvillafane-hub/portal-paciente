import { NextRequest, NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { rpID } from "@/config/webauthn";
import { passkeyChallenges } from "@/lib/passkey.challenge.store";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const userId = cookies().get("pp_session")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const methods = await prisma.authMethod.findMany({
    where: { userId, type: "passkey" },
  });

  if (methods.length === 0) {
    return NextResponse.json(
      { error: "No passkeys registered" },
      { status: 400 }
    );
  }

  const allowCredentials = methods.map((m) => ({
    id: Buffer.from(m.credentialId, "base64"),
    type: "public-key",
  }));

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials,
    userVerification: "preferred",
  });

  passkeyChallenges.set(userId, options.challenge);

  return NextResponse.json(options);
}
