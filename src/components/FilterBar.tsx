import { motion } from 'framer-motion';

type FilterBarProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <div className="sticky top-6 z-30 flex justify-center px-6 py-8">
      <nav className="flex flex-wrap justify-center gap-2 rounded-full bg-zinc-50/90 p-2 shadow-lg backdrop-blur-sm dark:bg-zinc-950/90">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active === category ? '' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            {active === category && (
              <motion.div
                layoutId="active-filter-pill"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className="absolute inset-0 rounded-full bg-zinc-950 dark:bg-zinc-50"
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                active === category
                  ? 'text-zinc-50 dark:text-zinc-950'
                  : 'text-zinc-950 dark:text-zinc-50'
              }`}
            >
              {category}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
