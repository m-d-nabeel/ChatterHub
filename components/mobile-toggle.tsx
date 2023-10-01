import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import ServerSidebar from "./server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

const MobileToggle = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }
  return (
    <Sheet>
      <SheetTrigger>
        <div className="mr-2 cursor-pointer bg-transparent md:hidden">
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
