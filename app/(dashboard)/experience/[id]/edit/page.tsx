"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";


// Define the Experience interface
interface Experience {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  location: string;
  duration: string;

}

// Form interface for typing
interface ExperienceForm {
  title: string;
  description: string;
  imageUrl: string;
  featured: boolean;

  location: string;
  duration: string;
}

// Sample experiences for demo purposes
const experiences: Experience[] = [
  {
    id: 1,
    title: "Kapadokya",
    description: "Peri bacaları ve balon turlarıyla ünlü Kapadokya, Türkiye'nin en sıra dışı rotalarından biri.",
    imageUrl: "https://picsum.photos/1200/600?random=1",
    featured: true,

    location: "Nevşehir, Türkiye",
    duration: "3 gün",
  
  },
  {
    id: 2,
    title: "Pamukkale",
    description: "Bembeyaz travertenleri ve termal sularıyla dünyaca ünlü bir doğa harikası olan Pamukkale.",
    imageUrl: "https://picsum.photos/1200/600?random=2",
    featured: false,

    location: "Denizli, Türkiye",
    duration: "2 gün",

  },
  {
    id: 3,
    title: "Efes Antik Kenti",
    description: "Tarihi kalıntıları ve görkemli kütüphanesiyle antik dünyanın gözde destinasyonu.",
    imageUrl: "https://picsum.photos/1200/600?random=3",
    featured: true,
    location: "İzmir, Türkiye",
    duration: "1 gün",

  },
  {
    id: 4,
    title: "Karadeniz Yaylaları",
    description: "Yeşilin binbir tonunu barındıran yaylalar, huzur ve serin hava arayanlar için birebir.",
    imageUrl: "https://picsum.photos/1200/600?random=4",
    featured: false,

    location: "Trabzon, Türkiye",
    duration: "4 gün",

  },
];

export default function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExperienceForm>({
    title: "",
    description: "",
    imageUrl: "",
    featured: false,

    location: "",
    duration: "",
  });

  useEffect(() => {
    // Find the experience from our demo data based on ID
    const foundExperience = experiences.find(exp => exp.id === parseInt(params.id));

    if (foundExperience) {
      setFormData({
        title: foundExperience.title,
        description: foundExperience.description,
        imageUrl: foundExperience.imageUrl,
        featured: foundExperience.featured,

        location: foundExperience.location,
        duration: foundExperience.duration,
      });
    } else {
      // If not found, use sample data
      setFormData({
        title: "Sample Experience",
        description: "This is a sample experience for demonstration purposes.",
        imageUrl: "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?q=80&w=1974&auto=format&fit=crop",
        featured: true,

        location: "Sample Location, Türkiye",
        duration: "2 gün",
      });
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, we would send this data to an API
      console.log("Updated form data:", formData);

      // Simulate success
      setTimeout(() => {
        router.push(`/experience/${params.id}`);
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Error updating experience:", error);
      alert("Failed to update experience. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex-grow w-screen">
        <div className="max-w-3xl mx-auto px-4 py-8 mt-16">
          <div className="mb-6 flex items-center">
            <Link
              href={`/experience/${params.id}`}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experience
            </Link>
          </div>

     

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">


              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  id="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    required
                    placeholder="e.g. 2 hours, 3 days"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Experience
                </label>
              </div>
            </div>


          </form>
        </div>
      </div>

    </div>
  );
} 