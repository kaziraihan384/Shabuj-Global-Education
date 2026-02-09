"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createUniversity, getAllUniversities, updateUniversity, deleteUniversity } from "@/actions/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  tuitionFee: number;
  ranking: number;
  establishedYear: number;
}

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUniversity, setDeletingUniversity] = useState<University | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      country: "",
      city: "",
      tuitionFee: "",
      ranking: "",
      establishedYear: "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      name: "",
      country: "",
      city: "",
      tuitionFee: "",
      ranking: "",
      establishedYear: "",
    },
  });

  async function fetchUniversities() {
    try {
      setIsLoading(true);
      const res = await getAllUniversities();
      if (res.status == 200) {
        setUniversities(res.data);
      }
    } catch (error) {
      toast.error("Failed to load universities");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUniversities();
  }, []);

  function onSubmit(values: any) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(async () => {
      const res = await createUniversity(formData);

      if (res?.status === 200) {
        toast.success("University added successfully");
        form.reset();
        await fetchUniversities();
      } else {
        toast.error("Something went wrong");
      }
    });
  }

  // Open edit modal
  function handleEdit(university: University) {
    setEditingUniversity(university);
    editForm.reset({
      name: university.name,
      country: university.country,
      city: university.city,
      tuitionFee: university.tuitionFee.toString(),
      ranking: university.ranking.toString(),
      establishedYear: university.establishedYear.toString(),
    });
    setIsEditModalOpen(true);
  }

  // Submit edit
  function onEditSubmit(values: any) {
    if (!editingUniversity) return;

    const formData = new FormData();
    formData.append("id", editingUniversity.id);
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    startTransition(async () => {
      const res = await updateUniversity(formData);

      if (res?.status === 200) {
        toast.success("University updated successfully");
        setIsEditModalOpen(false);
        setEditingUniversity(null);
        await fetchUniversities();
      } else {
        toast.error("Failed to update university");
      }
    });
  }

  // Open delete modal
  function handleDelete(university: University) {
    setDeletingUniversity(university);
    setIsDeleteModalOpen(true);
  }

  // Confirm delete
  function confirmDelete() {
    if (!deletingUniversity) return;

    startTransition(async () => {
      const res = await deleteUniversity(deletingUniversity.id);

      if (res?.status === 200) {
        toast.success("University deleted successfully");
        setIsDeleteModalOpen(false);
        setDeletingUniversity(null);
        await fetchUniversities();
      } else {
        toast.error("Failed to delete university");
      }
    });
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card className="p-6 max-w-4xl mx-auto border border-foreground rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Add University</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              "name",
              "country",
              "city",
              "tuitionFee",
              "ranking",
              "establishedYear",
            ] as const).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...f}
                        type={field.includes("Fee") || field.includes("ranking") || field.includes("Year") ? "number" : "text"}
                        placeholder={field}
                        disabled={isPending}
                        className=""
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <div className="md:col-span-3">
              <Button className="w-full" disabled={isPending}>
                {isPending ? "Adding..." : "Add University"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      <Card className="mx-6 p-6 border border-foreground rounded-xl">
        <h2 className="text-xl font-semibold mb-4">All Universities ({universities.length})</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading universities...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Established</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell>{u.city}</TableCell>
                    <TableCell>${u.tuitionFee.toLocaleString()}</TableCell>
                    <TableCell>{u.ranking}</TableCell>
                    <TableCell>{u.establishedYear}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(u)}
                          disabled={isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(u)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit University</DialogTitle>
            <DialogDescription>
              Make changes to {editingUniversity?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { name: "name", label: "Name", type: "text" },
                  { name: "country", label: "Country", type: "text" },
                  { name: "city", label: "City", type: "text" },
                  { name: "tuitionFee", label: "Tuition Fee", type: "number" },
                  { name: "ranking", label: "Ranking", type: "number" },
                  { name: "establishedYear", label: "Established Year", type: "number" },
                ] as const).map((field) => (
                  <FormField
                    key={field.name}
                    control={editForm.control}
                    name={field.name}
                    render={({ field: f }) => (
                      <FormItem>
                        <Label>{field.label}</Label>
                        <FormControl>
                          <Input
                            {...f}
                            type={field.type}
                            disabled={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Updating..." : "Update University"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-semibold">{deletingUniversity?.name}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}