import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import prismadb from "./db";

export const currentProfile = async () => {
  try {
    const current_user = await currentUser();
    if (!current_user) {
      return redirectToSignIn();
    }
    const profile = await prismadb.profile.findUnique({
      where: {
        userId: current_user.id,
      },
    });
    if (profile) {
      return profile;
    }
    const newProfile = await prismadb.profile.create({
      data: {
        userId: current_user.id,
        name: current_user.firstName + " " + current_user.lastName,
        imageUrl: current_user.imageUrl,
        email: current_user.emailAddresses[0].emailAddress,
      },
    });
    return newProfile;
  } catch (error) {
    console.error("currentProfile Server Error", error);
    throw error;
  }
};
