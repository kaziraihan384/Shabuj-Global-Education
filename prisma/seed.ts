import { prisma } from "@/lib/prisma";

const universities = [
  // USA
  { name: "Harvard University", country: "United States", city: "Cambridge", tuitionFee: 54002, ranking: 3, establishedYear: 1636 },
  { name: "Massachusetts Institute of Technology", country: "United States", city: "Cambridge", tuitionFee: 57986, ranking: 1, establishedYear: 1861 },
  { name: "Stanford University", country: "United States", city: "Stanford", tuitionFee: 56169, ranking: 2, establishedYear: 1885 },
  { name: "Yale University", country: "United States", city: "New Haven", tuitionFee: 62250, ranking: 9, establishedYear: 1701 },
  { name: "Princeton University", country: "United States", city: "Princeton", tuitionFee: 57410, ranking: 6, establishedYear: 1746 },
  { name: "Columbia University", country: "United States", city: "New York", tuitionFee: 65524, ranking: 7, establishedYear: 1754 },
  { name: "University of California, Berkeley", country: "United States", city: "Berkeley", tuitionFee: 44115, ranking: 8, establishedYear: 1868 },
  { name: "University of Chicago", country: "United States", city: "Chicago", tuitionFee: 62940, ranking: 10, establishedYear: 1890 },
  { name: "Cornell University", country: "United States", city: "Ithaca", tuitionFee: 63200, ranking: 12, establishedYear: 1865 },
  { name: "Duke University", country: "United States", city: "Durham", tuitionFee: 63054, ranking: 15, establishedYear: 1838 },
  
  // UK
  { name: "University of Oxford", country: "United Kingdom", city: "Oxford", tuitionFee: 36000, ranking: 4, establishedYear: 1096 },
  { name: "University of Cambridge", country: "United Kingdom", city: "Cambridge", tuitionFee: 35000, ranking: 5, establishedYear: 1209 },
  { name: "Imperial College London", country: "United Kingdom", city: "London", tuitionFee: 38000, ranking: 11, establishedYear: 1907 },
  { name: "University College London", country: "United Kingdom", city: "London", tuitionFee: 32000, ranking: 13, establishedYear: 1826 },
  { name: "London School of Economics", country: "United Kingdom", city: "London", tuitionFee: 25000, ranking: 45, establishedYear: 1895 },
  { name: "University of Edinburgh", country: "United Kingdom", city: "Edinburgh", tuitionFee: 28000, ranking: 22, establishedYear: 1583 },
  { name: "King's College London", country: "United Kingdom", city: "London", tuitionFee: 29000, ranking: 33, establishedYear: 1829 },
  { name: "University of Manchester", country: "United Kingdom", city: "Manchester", tuitionFee: 27000, ranking: 27, establishedYear: 1824 },
  
  // Canada
  { name: "University of Toronto", country: "Canada", city: "Toronto", tuitionFee: 55000, ranking: 21, establishedYear: 1827 },
  { name: "University of British Columbia", country: "Canada", city: "Vancouver", tuitionFee: 45000, ranking: 34, establishedYear: 1908 },
  { name: "McGill University", country: "Canada", city: "Montreal", tuitionFee: 42000, ranking: 30, establishedYear: 1821 },
  { name: "McMaster University", country: "Canada", city: "Hamilton", tuitionFee: 35000, ranking: 144, establishedYear: 1887 },
  { name: "University of Alberta", country: "Canada", city: "Edmonton", tuitionFee: 32000, ranking: 110, establishedYear: 1908 },
  
  // Australia
  { name: "Australian National University", country: "Australia", city: "Canberra", tuitionFee: 48000, ranking: 34, establishedYear: 1946 },
  { name: "University of Melbourne", country: "Australia", city: "Melbourne", tuitionFee: 46000, ranking: 14, establishedYear: 1853 },
  { name: "University of Sydney", country: "Australia", city: "Sydney", tuitionFee: 50000, ranking: 19, establishedYear: 1850 },
  { name: "University of Queensland", country: "Australia", city: "Brisbane", tuitionFee: 43000, ranking: 43, establishedYear: 1909 },
  { name: "Monash University", country: "Australia", city: "Melbourne", tuitionFee: 45000, ranking: 42, establishedYear: 1958 },
  
  // Germany
  { name: "Technical University of Munich", country: "Germany", city: "Munich", tuitionFee: 1500, ranking: 37, establishedYear: 1868 },
  { name: "Ludwig Maximilian University of Munich", country: "Germany", city: "Munich", tuitionFee: 1200, ranking: 54, establishedYear: 1472 },
  { name: "Heidelberg University", country: "Germany", city: "Heidelberg", tuitionFee: 1500, ranking: 50, establishedYear: 1386 },
  { name: "Humboldt University of Berlin", country: "Germany", city: "Berlin", tuitionFee: 1000, ranking: 117, establishedYear: 1810 },
  { name: "Free University of Berlin", country: "Germany", city: "Berlin", tuitionFee: 1200, ranking: 118, establishedYear: 1948 },
  
  // France
  { name: "Sorbonne University", country: "France", city: "Paris", tuitionFee: 3000, ranking: 60, establishedYear: 1150 },
  { name: "École Normale Supérieure", country: "France", city: "Paris", tuitionFee: 2500, ranking: 55, establishedYear: 1794 },
  { name: "Sciences Po", country: "France", city: "Paris", tuitionFee: 14000, ranking: 242, establishedYear: 1872 },
  
  // Netherlands
  { name: "Delft University of Technology", country: "Netherlands", city: "Delft", tuitionFee: 20000, ranking: 47, establishedYear: 1842 },
  { name: "University of Amsterdam", country: "Netherlands", city: "Amsterdam", tuitionFee: 12000, ranking: 53, establishedYear: 1632 },
  { name: "Utrecht University", country: "Netherlands", city: "Utrecht", tuitionFee: 11000, ranking: 66, establishedYear: 1636 },
  
  // Switzerland
  { name: "ETH Zurich", country: "Switzerland", city: "Zurich", tuitionFee: 1500, ranking: 7, establishedYear: 1855 },
  { name: "École Polytechnique Fédérale de Lausanne", country: "Switzerland", city: "Lausanne", tuitionFee: 1300, ranking: 16, establishedYear: 1853 },
  
  // Singapore
  { name: "National University of Singapore", country: "Singapore", city: "Singapore", tuitionFee: 38000, ranking: 11, establishedYear: 1905 },
  { name: "Nanyang Technological University", country: "Singapore", city: "Singapore", tuitionFee: 36000, ranking: 26, establishedYear: 1981 },
  
  // Japan
  { name: "University of Tokyo", country: "Japan", city: "Tokyo", tuitionFee: 6000, ranking: 28, establishedYear: 1877 },
  { name: "Kyoto University", country: "Japan", city: "Kyoto", tuitionFee: 6000, ranking: 36, establishedYear: 1897 },
  { name: "Osaka University", country: "Japan", city: "Osaka", tuitionFee: 5500, ranking: 80, establishedYear: 1931 },
  
  // China
  { name: "Tsinghua University", country: "China", city: "Beijing", tuitionFee: 5000, ranking: 17, establishedYear: 1911 },
  { name: "Peking University", country: "China", city: "Beijing", tuitionFee: 5000, ranking: 18, establishedYear: 1898 },
  { name: "Fudan University", country: "China", city: "Shanghai", tuitionFee: 4500, ranking: 50, establishedYear: 1905 },
  { name: "Shanghai Jiao Tong University", country: "China", city: "Shanghai", tuitionFee: 4500, ranking: 46, establishedYear: 1896 },
  
  // South Korea
  { name: "Seoul National University", country: "South Korea", city: "Seoul", tuitionFee: 8000, ranking: 29, establishedYear: 1946 },
  { name: "KAIST", country: "South Korea", city: "Daejeon", tuitionFee: 7000, ranking: 41, establishedYear: 1971 },
  
  // India
  { name: "Indian Institute of Technology Bombay", country: "India", city: "Mumbai", tuitionFee: 2000, ranking: 149, establishedYear: 1958 },
  { name: "Indian Institute of Technology Delhi", country: "India", city: "New Delhi", tuitionFee: 2000, ranking: 197, establishedYear: 1961 },
  { name: "Indian Institute of Science", country: "India", city: "Bangalore", tuitionFee: 1500, ranking: 225, establishedYear: 1909 },
  
  // Additional US Universities
  { name: "University of Pennsylvania", country: "United States", city: "Philadelphia", tuitionFee: 63452, ranking: 12, establishedYear: 1740 },
  { name: "Johns Hopkins University", country: "United States", city: "Baltimore", tuitionFee: 60480, ranking: 24, establishedYear: 1876 },
  { name: "Northwestern University", country: "United States", city: "Evanston", tuitionFee: 63468, ranking: 25, establishedYear: 1851 },
  { name: "New York University", country: "United States", city: "New York", tuitionFee: 58168, ranking: 31, establishedYear: 1831 },
  { name: "University of California, Los Angeles", country: "United States", city: "Los Angeles", tuitionFee: 43003, ranking: 20, establishedYear: 1919 },
  { name: "University of Michigan", country: "United States", city: "Ann Arbor", tuitionFee: 52266, ranking: 23, establishedYear: 1817 },
  { name: "University of Washington", country: "United States", city: "Seattle", tuitionFee: 39906, ranking: 63, establishedYear: 1861 },
  { name: "Carnegie Mellon University", country: "United States", city: "Pittsburgh", tuitionFee: 61344, ranking: 52, establishedYear: 1900 },
  { name: "Boston University", country: "United States", city: "Boston", tuitionFee: 60720, ranking: 70, establishedYear: 1839 },
  { name: "Brown University", country: "United States", city: "Providence", tuitionFee: 65146, ranking: 61, establishedYear: 1764 },
  
  // More European Universities
  { name: "University of Copenhagen", country: "Denmark", city: "Copenhagen", tuitionFee: 15000, ranking: 76, establishedYear: 1479 },
  { name: "Lund University", country: "Sweden", city: "Lund", tuitionFee: 12000, ranking: 75, establishedYear: 1666 },
  { name: "University of Oslo", country: "Norway", city: "Oslo", tuitionFee: 1000, ranking: 117, establishedYear: 1811 },
  { name: "KU Leuven", country: "Belgium", city: "Leuven", tuitionFee: 10000, ranking: 44, establishedYear: 1425 },
  { name: "Trinity College Dublin", country: "Ireland", city: "Dublin", tuitionFee: 22000, ranking: 98, establishedYear: 1592 },
];

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await prisma.university.deleteMany();

  // Create universities
  for (const university of universities) {
    await prisma.university.create({
      data: university,
    });
  }

  console.log(`Seeded ${universities.length} universities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });