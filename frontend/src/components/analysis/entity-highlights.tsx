import { Globe, Mail, Phone, Wallet, Link2 } from "lucide-react";
import { motion } from "framer-motion";

interface EntityHighlightsProps {
  entities: {
    urls?: string[];
    emails?: string[];
    phones?: string[];
    upi_ids?: string[];
    shortened_links?: string[];
  } | null | undefined;
}

const ENTITY_CONFIG = [
  { key: "urls", label: "URLs", icon: Globe, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { key: "emails", label: "Emails", icon: Mail, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { key: "phones", label: "Phones", icon: Phone, color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  { key: "upi_ids", label: "UPI IDs", icon: Wallet, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  { key: "shortened_links", label: "Shortened Links", icon: Link2, color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
] as const;

export function EntityHighlights({ entities }: EntityHighlightsProps) {
  if (!entities) return null;

  const activeEntities = ENTITY_CONFIG.filter(
    (config) => entities[config.key as keyof typeof entities]?.length
  );

  if (activeEntities.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-foreground">Detected Entities</h4>
      <div className="flex flex-wrap gap-2">
        {activeEntities.map((config) => {
          const items = entities[config.key as keyof typeof entities] ?? [];
          const Icon = config.icon;
          return items.map((item, i) => (
            <motion.span
              key={`${config.key}-${i}`}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors cursor-default hover:shadow-md ${config.color}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.length > 40 ? item.slice(0, 37) + "..." : item}
            </motion.span>
          ));
        })}
      </div>
    </div>
  );
}
