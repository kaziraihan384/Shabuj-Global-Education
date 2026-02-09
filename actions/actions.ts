"use server";


import { prisma } from "@/lib/prisma";

import { unstable_cache } from "next/cache";


export async function createUniversity(formData: FormData) {
  const data = await prisma.university.create({
    data: {
      name: formData.get("name") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
      tuitionFee: Number(formData.get("tuitionFee")),
      ranking: Number(formData.get("ranking")),
      establishedYear: Number(formData.get("establishedYear")),
    },

  });

  return { status: 200, data: data }

}


export async function getAllUniversities() {
  const data = await prisma.university.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { status: 200, data: data };
}


export interface UniversityFilters {
  country?: string;
  city?: string;
  minTuition?: number;
  maxTuition?: number;
  minRanking?: number;
  maxRanking?: number;
  minEstablished?: number;
  maxEstablished?: number;
  searchQuery?: string;
  sortBy?: "ranking" | "tuitionFee" | "establishedYear" | "name";
  sortOrder?: "asc" | "desc";
}

export interface FilterOptions {
  countries: string[];
  cities: string[];
  tuitionRange: { min: number; max: number };
  rankingRange: { min: number; max: number };
  establishedRange: { min: number; max: number };
}

// Get all unique filter options for dropdowns
export async function getFilterOptions(): Promise<FilterOptions> {
  const getCachedOptions = unstable_cache(
    async () => {
      const universities = await prisma.university.findMany({
        select: {
          country: true,
          city: true,
          tuitionFee: true,
          ranking: true,
          establishedYear: true,
        },
      });

      const countries = [...new Set(universities.map((u) => u.country))].sort();
      const cities = [...new Set(universities.map((u) => u.city))].sort();

      const tuitionFees = universities.map((u) => u.tuitionFee);
      const rankings = universities.map((u) => u.ranking);
      const years = universities.map((u) => u.establishedYear);
      console.log(
        {
          countries,
          cities,
          tuitionRange: {
            min: Math.min(...tuitionFees),
            max: Math.max(...tuitionFees),
          },
          rankingRange: {
            min: Math.min(...rankings),
            max: Math.max(...rankings),
          },
          establishedRange: {
            min: Math.min(...years),
            max: Math.max(...years),
          },
        }
      )
      return {
        countries,
        cities,
        tuitionRange: {
          min: Math.min(...tuitionFees),
          max: Math.max(...tuitionFees),
        },
        rankingRange: {
          min: Math.min(...rankings),
          max: Math.max(...rankings),
        },
        establishedRange: {
          min: Math.min(...years),
          max: Math.max(...years),
        },
      };
    },
    ["filter-options"],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ["universities"],
    }
  );

  return getCachedOptions();
}

// Advanced filtering with server-side logic
export async function filterUniversities(filters: UniversityFilters) {
  try {
    const whereClause: any = {};

    // Country filter
    if (filters.country && filters.country !== "all") {
      whereClause.country = filters.country;
    }

    // City filter
    if (filters.city && filters.city !== "all") {
      whereClause.city = filters.city;
    }

    // Tuition fee range filter
    if (filters.minTuition !== undefined || filters.maxTuition !== undefined) {
      whereClause.tuitionFee = {};
      if (filters.minTuition !== undefined) {
        whereClause.tuitionFee.gte = filters.minTuition;
      }
      if (filters.maxTuition !== undefined) {
        whereClause.tuitionFee.lte = filters.maxTuition;
      }
    }

    // Ranking range filter
    if (filters.minRanking !== undefined || filters.maxRanking !== undefined) {
      whereClause.ranking = {};
      if (filters.minRanking !== undefined) {
        whereClause.ranking.gte = filters.minRanking;
      }
      if (filters.maxRanking !== undefined) {
        whereClause.ranking.lte = filters.maxRanking;
      }
    }

    // Established year range filter
    if (
      filters.minEstablished !== undefined ||
      filters.maxEstablished !== undefined
    ) {
      whereClause.establishedYear = {};
      if (filters.minEstablished !== undefined) {
        whereClause.establishedYear.gte = filters.minEstablished;
      }
      if (filters.maxEstablished !== undefined) {
        whereClause.establishedYear.lte = filters.maxEstablished;
      }
    }

    // Search query filter (searches in name, country, and city)
    if (filters.searchQuery && filters.searchQuery.trim() !== "") {
      const searchTerm = filters.searchQuery.trim();
      whereClause.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { country: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    // Sorting
    const orderBy: any = {};
    const sortBy = filters.sortBy || "ranking";
    const sortOrder = filters.sortOrder || "asc";
    orderBy[sortBy] = sortOrder;

    const universities = await prisma.university.findMany({
      where: whereClause,
      orderBy,
    });

    return {
      status: 200,
      data: universities,
      count: universities.length,
    };
  } catch (error) {
    console.error("Error filtering universities:", error);
    return {
      status: 500,
      data: [],
      count: 0,
      error: "Failed to filter universities",
    };
  }
}

// Get universities by specific IDs (for compare feature)
export async function getUniversitiesByIds(ids: string[]) {
  try {
    const universities = await prisma.university.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return {
      status: 200,
      data: universities,
    };
  } catch (error) {
    console.error("Error fetching universities by IDs:", error);
    return {
      status: 500,
      data: [],
      error: "Failed to fetch universities",
    };
  }
}

// Get university count by country (for statistics)
export async function getUniversityStatsByCountry() {
  try {
    const stats = await prisma.university.groupBy({
      by: ["country"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    return {
      status: 200,
      data: stats.map((stat) => ({
        country: stat.country,
        count: stat._count.id,
      })),
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      status: 500,
      data: [],
      error: "Failed to fetch statistics",
    };
  }
}

// Innovative filter: Get universities by budget category
export async function getUniversitiesByBudgetCategory(
  category: "budget" | "moderate" | "premium" | "luxury"
) {
  const budgetRanges = {
    budget: { min: 0, max: 15000 },
    moderate: { min: 15001, max: 30000 },
    premium: { min: 30001, max: 50000 },
    luxury: { min: 50001, max: 999999 },
  };

  const range = budgetRanges[category];

  return filterUniversities({
    minTuition: range.min,
    maxTuition: range.max,
    sortBy: "tuitionFee",
    sortOrder: "asc",
  });
}

// Innovative filter: Get universities by age category
export async function getUniversitiesByAgeCategory(
  category: "historic" | "established" | "modern" | "new"
) {
  const currentYear = new Date().getFullYear();
  const ageRanges = {
    historic: { min: 0, max: currentYear - 150 }, // Over 150 years old
    established: { min: currentYear - 150, max: currentYear - 50 }, // 50-150 years
    modern: { min: currentYear - 50, max: currentYear - 20 }, // 20-50 years
    new: { min: currentYear - 20, max: currentYear }, // Less than 20 years
  };

  const range = ageRanges[category];

  return filterUniversities({
    minEstablished: range.min,
    maxEstablished: range.max,
    sortBy: "establishedYear",
    sortOrder: "desc",
  });
}

// Innovative filter: Get "best value" universities (high ranking, low tuition)
export async function getBestValueUniversities(limit: number = 10) {
  try {
    // Universities with ranking < 500 and tuition < median
    const allUniversities = await prisma.university.findMany();
    const medianTuition =
      allUniversities
        .map((u) => u.tuitionFee)
        .sort((a, b) => a - b)[Math.floor(allUniversities.length / 2)] || 25000;

    const universities = await prisma.university.findMany({
      where: {
        ranking: {
          lte: 500,
        },
        tuitionFee: {
          lte: medianTuition,
        },
      },
      orderBy: {
        ranking: "asc",
      },
      take: limit,
    });

    return {
      status: 200,
      data: universities,
      count: universities.length,
    };
  } catch (error) {
    console.error("Error fetching best value universities:", error);
    return {
      status: 500,
      data: [],
      count: 0,
      error: "Failed to fetch best value universities",
    };
  }
}