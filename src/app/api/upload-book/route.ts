import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import EPub from "epub";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EPubMetadata {
  title?: string;
  creator?: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Upload to Supabase
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("books")
      .upload(fileName, file);

    if (error) throw error;

    // Extract metadata
    let title = file.name;
    let author = null;

    if (file.name.endsWith(".epub")) {
      const tempFilePath = join(tmpdir(), `${Date.now()}-${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      await writeFile(tempFilePath, Buffer.from(arrayBuffer));

      const epub = new EPub(tempFilePath);
      const metadata = await new Promise<EPubMetadata>((resolve, reject) => {
        epub.parse();
        epub.on("end", () => resolve(epub.metadata));
        epub.on("error", reject);
      });
      title = metadata.title || title;
      author = metadata.creator;
    }

    // Save to database
    const book = await prisma.book.create({
      data: {
        title,
        author,
        filePath: data.path,
        fileType: file.name.endsWith(".epub") ? "EPUB" : "PDF",
        userId,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
