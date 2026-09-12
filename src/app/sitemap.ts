import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

const base = "https://beneventoveiculos.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/estoque", "/sobre", "/contato"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const vehicles = await getVehicles();
  const vehicleRoutes = vehicles.map((v) => ({
    url: `${base}/estoque/${v.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
