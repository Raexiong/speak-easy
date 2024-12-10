export async function deleteBook(bookId: string) {
  try {
    const response = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete book");
    }

    return response;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}
