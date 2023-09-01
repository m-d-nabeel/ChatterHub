import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import InitialModal from "@/components/modals/initial-modal";
import { Profile } from "@prisma/client";

const SetupPage = async () => {
  const profile: Profile = await currentProfile();
  const server = await prismadb.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`servers/${server.id}`);
  }
  return <InitialModal name={profile.name.split(" ")[0]} />;
};

export default SetupPage;
