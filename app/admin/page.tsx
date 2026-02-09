"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { createUniversity, getAllUniversities } from "@/actions/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [universities, setUniversities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  async function fetchUniversities() {
    try {
      setIsLoading(true);
      const res = await getAllUniversities();
      if(res.status == 200) {
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


  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card className="p-6 max-w-4xl mx-auto">
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

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Universities</h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading universities...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Tuition</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Established</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.country}</TableCell>
                  <TableCell>{u.city}</TableCell>
                  <TableCell>${u.tuitionFee}</TableCell>
                  <TableCell>{u.ranking}</TableCell>
                  <TableCell>{u.establishedYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}