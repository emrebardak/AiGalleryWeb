type FilterBarProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <nav className="sticky top-0 z-30 flex flex-wrap justify-center gap-3 bg-zinc-50/90 px-4 py-6 backdrop-blur-sm dark:bg-zinc-950/90">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            active === category
              ? 'bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950'
              : 'bg-zinc-200 text-zinc-950 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700'
          }`}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}
