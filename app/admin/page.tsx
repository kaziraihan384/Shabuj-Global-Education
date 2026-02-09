
import { createUniversity, getAllUniversities } from "@/actions/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "University Admin",
};

export default async function AdminUniversitiesPage() {
  const universities = await getAllUniversities();

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* CREATE FORM */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add University</h2>

        <form action={createUniversity} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="name" placeholder="University Name" required />
          <Input name="country" placeholder="Country" required />
          <Input name="city" placeholder="City / State" required />
          <Input name="tuitionFee" type="number" placeholder="Tuition Fee" required />
          <Input name="ranking" type="number" placeholder="Ranking" required />
          <Input
            name="establishedYear"
            type="number"
            placeholder="Established Year"
            required
          />

          <div className="md:col-span-3">
            <Button className="w-full">Add University</Button>
          </div>
        </form>
      </Card>

      {/* LIST TABLE */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Universities</h2>

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
      </Card>
    </div>
  );
}