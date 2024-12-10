"use client";
import { Book } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteBook } from "./actions/delete";
import { useRouter } from "next/navigation";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await deleteBook(book.id);
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <Link href={`/reader/${book.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="truncate">{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {book.author || "Unknown Author"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Added {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <button
            className="text-red-400 hover:text-red-600 transition-colors"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    </Link>
  );
}
