import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import { Profile } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

const MobileToggle = async ({ serverId }: { serverId: string }) => {
  const profile: Profile = await currentProfile();
  return (
    <Sheet>
      <SheetTrigger>
        <div className="cursor-pointer bg-transparent md:hidden mr-2">
          <MenuIcon />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="m-0 flex w-80 gap-0 border-transparent p-0"
      >
        <NavigationSidebar />
        <ServerSidebar serverId={serverId} profileId={profile.id} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
