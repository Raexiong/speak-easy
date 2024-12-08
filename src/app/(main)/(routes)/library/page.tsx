import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function LibraryPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check if user exists in our database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { library: true },
  });

  // If user doesn't exist in our database, create them
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        clerkId: userId,
      },
      include: { library: true },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">My Library</h1>
      {dbUser.library.length === 0 ? (
        <p>No books in your library yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dbUser.library.map((book) => (
            <div key={book.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{book.title}</h3>
              {book.author && (
                <p className="text-sm text-gray-600">{book.author}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
