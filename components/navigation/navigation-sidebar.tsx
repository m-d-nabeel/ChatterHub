import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

// local imports
import { ModeToggle } from "../mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import MessageAction from "./message-action";
import NavigationItem from "./navigation-item";

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await prismadb.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="bg-discord-gray4 flex h-full flex-col justify-between py-3">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <MessageAction />
        <Separator className="bg-discord-gray1 mx-auto h-[2px] w-10 rounded-md" />

        <ScrollArea className="max-h-96 w-[72px] rounded-md">
          <div className="flex flex-col items-center justify-center gap-y-4">
            {servers.map((server) => (
              <div key={server.id} className="h-12 w-12">
                <NavigationItem
                  id={server.id}
                  name={server.name}
                  imageUrl={server.imageUrl}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="bg-discord-gray1 mx-auto h-[2px] w-10 rounded-md" />
        <NavigationAction />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-4 pb-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-12 w-12",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSidebar;
