export const dynamic = "force-dynamic";

import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import prismadb from "@/lib/db";

export const currentProfilePagesRouting = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

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
