import prismadb from "./db";

export const getConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    if (memberOneId === memberTwoId) {
      return null;
    }
    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));
    if (!conversation) {
      conversation = await createConversation(memberOneId, memberTwoId);
    }
    return conversation;
  } catch (error) {
    console.error(error);
    throw new Error("Fetch error: " + error);
  }
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await prismadb.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await prismadb.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        memberTwo: {
          include: { profile: true },
        },
      },
    });
    return conversation;
  } catch (error) {
    return null;
  }
};
