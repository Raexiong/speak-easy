import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookUpload } from "../../../../components/library/book-upload";
import { BookGrid } from "../../../../components/library/book-grid";
import { getUserBooks } from "../../../../lib/books";

export default async function LibraryPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      library: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        clerkId: userId,
      },
      include: { library: true },
    });
  }

  const books = await getUserBooks(userId);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Library</h1>
        <BookUpload />
      </div>
      <BookGrid books={books} />
    </div>
  );
}
