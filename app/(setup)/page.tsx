import { redirect } from "next/navigation";
import prismadb from "@/lib/db";
import InitialModal from "@/components/modals/initial-modal";
import { Profile } from "@prisma/client";
import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile: Profile = await initialProfile();
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
