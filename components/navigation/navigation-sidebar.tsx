import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

// local imports
// import { ModeToggle } from "../mode-toggle";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/db";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
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
    <div className="flex h-full flex-col justify-between bg-discord-gray4 py-3">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <MessageAction />
        <Separator className="mx-auto h-[2px] w-10 rounded-md bg-discord-gray1" />

        <ScrollArea className="max-h-96 w-[72px] rounded-md">
          <div className="flex flex-col items-center justify-center gap-y-4">
            {servers.map((server) => (
              <div key={server.id} className="h-12 w-12">
                <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
              </div>
            ))}
          </div>
        </ScrollArea>
        <Separator className="mx-auto h-[2px] w-10 rounded-md bg-discord-gray1" />
        <NavigationAction />
      </div>
      <div className="flex flex-col items-center justify-center gap-y-4 pb-3">
        {/* <ModeToggle /> */}
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
