import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  try {
    const { bookId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
        userId: userId,
      },
    });

    if (!book) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("books")
      .remove([book.filePath]);

    if (storageError) {
      throw storageError;
    }

    // Delete from database
    await prisma.book.delete({
      where: {
        id: params.bookId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
