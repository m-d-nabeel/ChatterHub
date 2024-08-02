export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/db";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await prismadb.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
