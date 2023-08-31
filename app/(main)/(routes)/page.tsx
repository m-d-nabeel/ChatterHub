import { ModeToggle } from "@/components/mode-toggle";
import prismadb from "@/lib/db";
import { UserButton, currentUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

export default async function Home() {
  const user: User | null = await currentUser();
  if (!user) {
    return null;
  }

  const profile = await prismadb.profile.create({
    data: {
      userId: user.id,
      name: user.firstName + " " + user.lastName,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
