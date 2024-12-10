"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function BookUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-book", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        accept=".epub,.pdf"
        onChange={handleUpload}
        disabled={isLoading}
        className="hidden"
        id="book-upload"
      />
      <Button
        disabled={isLoading}
        onClick={() => document.getElementById("book-upload")?.click()}
      >
        {isLoading ? "Uploading..." : "Upload Book"}
      </Button>
    </div>
  );
}
