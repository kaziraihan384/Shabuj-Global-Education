# 🎓 University Finder - Advanced University Search & Comparison Platform

A modern, full-stack web application built with Next.js 16 that helps students find their perfect university through advanced filtering, comparison tools, and data-driven insights.
![alt text](image-1.png)

## 🌟 Overview

University Finder is a comprehensive platform designed to simplify the university selection process. Students can explore universities worldwide, filter by multiple criteria, compare institutions side-by-side, and make informed decisions about their higher education journey.

## ✨ Key Features

### 🔍 Advanced Search & Filtering
- **Multi-criteria Filtering**: Filter universities by country, city, tuition fees, global ranking, and establishment year
- **Real-time Search**: Instant search across university names, locations, and countries
- **Range Sliders**: Interactive sliders for tuition fee, ranking, and year ranges
- **Smart Sorting**: Sort results by ranking, tuition fee, establishment year, or name (ascending/descending)

### 🎯 Quick Filter Presets
- **Best Value Universities**: Automatically find top-ranked universities with below-median tuition fees
- **Top 100 Ranked**: Filter the world's highest-ranked institutions
- **Affordable Options**: Universities with tuition under $20,000/year
- **Historic Institutions**: Universities established over 100 years ago

### 📊 Comparison Tools
- **Side-by-Side Comparison**: Compare up to 2 universities simultaneously
- **Detailed Metrics**: View differences in tuition fees, rankings, and institutional age
- **Visual Comparison**: Clean, card-based comparison interface with key insights

### 🎨 User Experience
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Fast Performance**: Server-side rendering with optimized caching strategies
- **Real-time Updates**: Instant feedback with toast notifications

### 🔧 Admin Dashboard (/admin)
- **University Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Bulk Data Entry**: Streamlined form for adding new universities
- **Edit Capabilities**: Update university information with pre-filled modal forms
- **Safe Deletion**: Confirmation dialogs prevent accidental data loss
- **Live Data Table**: View all universities with formatted data and action buttons
- **Validation**: Form validation ensures data integrity![alt text](image.png)


## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form
- **State Management**: React Hooks (useState, useTransition)
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js Server Actions
- **Caching**: Next.js unstable_cache with tag-based revalidation

### Performance Optimizations
- **Server-Side Caching**: Filter options cached for 1 hour with automatic revalidation
- **Database Indexing**: Optimized queries with indexes on country, ranking, and tuition fee
- **Efficient Queries**: Prisma with optimized where clauses and orderBy
- **Client-Side Optimization**: Memoized computations with useMemo
- **Suspense Boundaries**: Proper loading states for better UX

## 🗄️ Database Schema

```prisma
model University {
  id              String   @id @default(uuid())
  name            String
  country         String
  city            String
  tuitionFee      Int
  ranking         Int
  establishedYear Int
  createdAt       DateTime @default(now())
  
  @@index([country])
  @@index([ranking])
  @@index([tuitionFee])
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd university-finder
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/university_db"
```

4. **Run database migrations**
```bash
npx prisma generate
npx prisma db push
```

5. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open the application**
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                 # Main university finder page
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── layout.tsx              # Root layout
├── actions/
│   └── actions.ts              # Server actions (CRUD operations)
├── components/
│   └── ui/                     # Shadcn UI components
├── lib/
│   └── prisma.ts              # Prisma client instance
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                     # Static assets
```

## 🎯 Core Functionality

### Filtering System
The application implements a sophisticated multi-parameter filtering system:
- Combines WHERE clauses for country, city, tuition range, ranking range, and year range
- Case-insensitive search across name, country, and city fields
- Dynamic sorting with customizable order (asc/desc)

### Caching Strategy
- Filter options cached server-side using `unstable_cache`
- Cache revalidation every 3600 seconds (1 hour)
- Tag-based invalidation on university creation/update/deletion
- Ensures fresh data while minimizing database queries

### Admin Features
- **Create**: Add new universities with comprehensive form validation
- **Read**: View all universities in a sortable, formatted table
- **Update**: Edit university details via modal with pre-filled data
- **Delete**: Remove universities with confirmation dialog protection

## 🎨 UI/UX Highlights

- **Filter Persistence**: Filter state maintained during searches
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: Graceful error messages with toast notifications
- **Empty States**: Helpful messages when no results found
- **Responsive Tables**: Horizontal scroll on mobile devices
- **Badge System**: Visual indicators for top-ranked universities
- **Modal Workflows**: Non-intrusive editing and deletion flows

## 📈 Future Enhancements

- [ ] User authentication and saved searches
- [ ] Favorite/bookmark universities
- [ ] Advanced analytics and statistics
- [ ] Export comparison results to PDF
- [ ] Integration with external university APIs
- [ ] Student reviews and ratings
- [ ] Application deadline tracking
- [ ] Scholarship information database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Built with ❤️ using modern web technologies to help students make informed decisions about their education.

---

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Modern database toolkit
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Re-usable component library

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.