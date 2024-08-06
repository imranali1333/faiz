import prisma from "../../utilities/prismaclient";

// services/userService.ts
export async function searchUsers(query: string, fields: string[]): Promise<any[]> {
  // Construct search criteria based on fields
  const searchCriteria = {
    OR: fields.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive',
      },
    })),
  };

  try {
    // Query the user model based on criteria
    const users = await prisma.user.findMany({
      where: searchCriteria,
      orderBy: { firstName: 'asc' }, // Order results by first name
      take: 10, // Limit results to 10
    });

    return users;
  } catch (error) {
    console.error('Error searching for users:', error);
    throw new Error('Error searching for users');
  }
}
