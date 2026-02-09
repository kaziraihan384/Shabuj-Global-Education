"use server";


import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function createUniversity(formData: FormData) {
    await prisma.university.create({
        data: {
            name: formData.get("name") as string,
            country: formData.get("country") as string,
            city: formData.get("city") as string,
            tuitionFee: Number(formData.get("tuitionFee")),
            ranking: Number(formData.get("ranking")),
            establishedYear: Number(formData.get("establishedYear")),
        },
    });


    revalidatePath("/admin/");
}


export async function getAllUniversities() {
    return prisma.university.findMany({
        orderBy: { createdAt: "desc" },
    });
}