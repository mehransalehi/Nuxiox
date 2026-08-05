import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. GET /api/services/public
  app.get("/api/services/public", (req, res) => {
    res.json([
      {
        id: 1,
        title: "Toddler Discovery & Sensory",
        description: "Focusing on early speech development, tactile play, fine motor skills, and soft social interactions.",
        icon: "🌱",
        ageGroup: "1.5 - 3 Years",
        order: 1
      },
      {
        id: 2,
        title: "Early Creative Arts & Crafts",
        description: "Expressive painting, pottery clay modeling, puppet theater, and creative musical movement.",
        icon: "🎨",
        ageGroup: "3 - 4 Years",
        order: 2
      },
      {
        id: 3,
        title: "Kindergarten Prep & Phonics",
        description: "Foundational alphabet phonics, beginner vocabulary, math logic, and group collaboration.",
        icon: "🧩",
        ageGroup: "4 - 5 Years",
        order: 3
      },
      {
        id: 4,
        title: "Junior STEM & Science Corner",
        description: "Hands-on water flow physics, garden biology, simple coding games, and safe science experiments.",
        icon: "🚀",
        ageGroup: "5 - 6 Years",
        order: 4
      },
      {
        id: 5,
        title: "Music, Movement & Rhythm",
        description: "Xylophone melodies, sing-alongs, traditional folk dances, and body percussion rhythm training.",
        icon: "🎵",
        ageGroup: "All Ages",
        order: 5
      },
      {
        id: 6,
        title: "Outdoor Exploration & Sports",
        description: "Balance bike tracks, mini gymnastics, organic vegetable garden planting, and nature treasure hunts.",
        icon: "🌿",
        ageGroup: "All Ages",
        order: 6
      }
    ]);
  });

  // 2. GET /api/colleagues/public
  app.get("/api/colleagues/public", (req, res) => {
    res.json([
      {
        id: 1,
        name: "Sarah Jenkins, M.Ed.",
        role: "Kindergarten Principal & Lead Educator",
        bio: "18+ years in early childhood education. Passionate about Montessori and Reggio Emilia child-led learning frameworks.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        order: 1
      },
      {
        id: 2,
        name: "Maria Rodriguez",
        role: "Preschool & Creative Arts Specialist",
        bio: "Specializes in sensory arts, pottery, and creative storytelling that builds emotional intelligence.",
        image: "https://images.unsplash.com/photo-1580894732413-a7510705a66a?auto=format&fit=crop&w=400&q=80",
        order: 2
      },
      {
        id: 3,
        name: "Dr. David Chen",
        role: "Junior STEM & Phonics Instructor",
        bio: "Former child psychologist turned STEM educator, creating joyful science and logic games for young minds.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
        order: 3
      },
      {
        id: 4,
        name: "Elena Rostova",
        role: "Music & Physical Development Coach",
        bio: "Orff Schulwerk certified music teacher bringing rhythm, dance, and motor coordination to daily classes.",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
        order: 4
      }
    ]);
  });

  // 3. GET /api/testimonials/public
  app.get("/api/testimonials/public", (req, res) => {
    res.json([
      {
        id: 1,
        name: "Emily & Mark Thompson",
        content: "Enrolling our daughter at Sunshine Kids was the best decision we made! The teachers are so warm and her confidence has skyrocketed.",
        rating: 5,
        order: 1
      },
      {
        id: 2,
        name: "Sami & Layla Al-Mansoor",
        content: "The facility is exceptionally clean and safe. Our son loves the organic lunches and comes home singing new songs every day!",
        rating: 5,
        order: 2
      },
      {
        id: 3,
        name: "Reza & Maryam Hosseini",
        content: "The multicultural environment and dedicated teachers created such a gentle transition for our 3-year-old. Truly 5 stars!",
        rating: 5,
        order: 3
      }
    ]);
  });

  // 4. GET /api/blog/posts/recent
  app.get("/api/blog/posts/recent", (req, res) => {
    res.json([
      {
        id: 1,
        title: "5 Gentle Tips for Smooth First-Day Kindergarten Transitions",
        slug: "5-tips-first-day-transition",
        excerpt: "Preparing your child for their first week at school with positive morning routines and comforting goodbye rituals.",
        featuredImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
        createdAt: "2026-08-01"
      },
      {
        id: 2,
        title: "The Power of Sensory Play in Toddler Brain Development",
        slug: "power-of-sensory-play",
        excerpt: "Why squishy clay, finger paints, and outdoor sandboxes stimulate neural connections and problem-solving skills.",
        featuredImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80",
        createdAt: "2026-07-28"
      },
      {
        id: 3,
        title: "Nutritious & Fun Snack Recipes Kids Love to Make (And Eat!)",
        slug: "nutritious-kid-friendly-snacks",
        excerpt: "Easy, colorful, pediatric-approved snack ideas you can assemble with your little chef at home.",
        featuredImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
        createdAt: "2026-07-20"
      }
    ]);
  });

  // 5. GET /api/settings/public
  app.get("/api/settings/public", (req, res) => {
    res.json({
      general: {
        showSidebar: false,
        direction: "ltr",
        language: "en"
      },
      navbar: {
        menus: [
          { label: "Home", href: "#hero" },
          { label: "About Us", href: "#about" },
          { label: "Programs", href: "#services" },
          { label: "Why Us", href: "#whyus" },
          { label: "Teachers", href: "#team" },
          { label: "News", href: "#blog" },
          { label: "Contact", href: "#contact" }
        ],
        darkLogo: "/logo-dark.png",
        lightLogo: "/logo-light.png",
        info: [
          { key: "phone", value: "+1 (555) 321-7890" },
          { key: "email", value: "hello@sunshinekids.com" }
        ]
      },
      footer: {
        menus: [
          { label: "Home", href: "#hero" },
          { label: "About Us", href: "#about" },
          { label: "Programs", href: "#services" },
          { label: "Contact", href: "#contact" }
        ],
        darkLogo: "/logo-dark.png",
        lightLogo: "/logo-light.png",
        info: [
          { key: "address", value: "742 Evergreen Terrace, Springfield, CA" }
        ]
      },
      seo: {
        siteName: "Sunshine Kids Kindergarten",
        defaultTitle: "Sunshine Kids Kindergarten - Joyful Play & Learning",
        titleSuffix: "| Kindergarten & Preschool",
        defaultDescription: "A loving, play-based kindergarten environment with certified teachers, organic meals, and STEM learning.",
        robots: "index, follow"
      }
    });
  });

  // Booking endpoint
  app.post("/api/booking", (req, res) => {
    const { parentName, childName, childAge, preferredDate } = req.body;
    console.log("New tour booking received:", req.body);
    res.json({
      success: true,
      message: `Tour scheduled for ${parentName} on ${preferredDate}`
    });
  });

  // Contact form submission endpoint
  app.post("/api/contact", (req, res) => {
    console.log("New contact message:", req.body);
    res.json({
      success: true,
      message: "Message sent successfully"
    });
  });

  // Theme inspector endpoint
  app.get("/api/theme/files", (req, res) => {
    try {
      const themeDir = path.join(process.cwd(), "kindergarten-theme");
      const readDirRecursive = (dir: string): any[] => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        return entries.map((entry) => {
          const fullPath = path.join(dir, entry.name);
          const relativePath = path.relative(themeDir, fullPath);
          if (entry.isDirectory()) {
            return {
              name: entry.name,
              type: "directory",
              path: relativePath,
              children: readDirRecursive(fullPath)
            };
          } else {
            const content = fs.readFileSync(fullPath, "utf-8");
            return {
              name: entry.name,
              type: "file",
              path: relativePath,
              content
            };
          }
        });
      };

      if (fs.existsSync(themeDir)) {
        res.json({
          themeName: "kindergarten-theme",
          files: readDirRecursive(themeDir)
        });
      } else {
        res.status(404).json({ error: "Theme directory not found" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kindergarten App running on http://localhost:${PORT}`);
  });
}

startServer();
