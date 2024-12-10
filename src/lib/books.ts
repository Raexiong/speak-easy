import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserBooks(userId: string) {
  return prisma.book.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
