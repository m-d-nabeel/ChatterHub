import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface ServerIdLayoutProps {
  children: ReactNode;
  params: { serverId: string };
}

const ServerIdLayout: FC<ServerIdLayoutProps> = async ({
  children,
  params,
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 hidden h-full w-60 md:block">
        <ServerSidebar serverId={params.serverId} profileId={profile.id} />
      </div>
      <main className="h-full w-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
