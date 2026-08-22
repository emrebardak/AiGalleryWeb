type FilterBarProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <div className="sticky top-4 z-30 flex justify-center px-4 py-6">
      <nav className="flex flex-wrap justify-center gap-2 rounded-full bg-zinc-50/90 p-2 shadow-lg backdrop-blur-sm dark:bg-zinc-950/90">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              active === category
                ? 'bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
                : 'text-zinc-950 hover:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {category}
          </button>
        ))}
      </nav>
    </div>
  );
}
