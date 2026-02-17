import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { rpID } from "@/config/webauthn";
import { passkeyChallenges } from "@/lib/passkey.challenge.store";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
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

  const options = await generateRegistrationOptions({
    rpID,
    rpName: "Portal del Paciente",
    userID: user.id,
    userName: user.email,
    userDisplayName: user.fullName,
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "preferred",
    },
  });

  passkeyChallenges.set(user.id, options.challenge);

  return NextResponse.json(options);
}
