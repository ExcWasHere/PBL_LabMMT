import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../common/card";

const API_BASE_URL = "http://localhost:3000";
const PUBLIC_PROJECT_ENDPOINT = `${API_BASE_URL}/project/public`;

const withBaseUrl = (url?: string) => {
  if (!url) return "/proyek/ar.jpg";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
};

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

export function HomeProject() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(PUBLIC_PROJECT_ENDPOINT)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setProjects(sorted.slice(0, 3));
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900"
        >
          Projects
        </motion.h2>

        <div className="mt-4 mb-10">
          <div className="h-1 w-12 bg-orange-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link to={`/project/slug/${slugify(p.title)}`}>
                <Card
                  title={p.title}
                  desc={p.description}
                  image={withBaseUrl(p.thumbnailUrl)}
                  date={p.year}
                  tags={p.tech ? p.tech.split(",") : []}
                  kategori={p.kategori}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link to="/project">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg">
              See All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}