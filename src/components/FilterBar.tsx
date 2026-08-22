type FilterBarProps = {
  categories: string[];
  active: string;
  onSelect: (category: string) => void;
};

export function FilterBar({ categories, active, onSelect }: FilterBarProps) {
  return (
    <nav className="flex flex-wrap justify-center gap-3 px-4 py-8">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
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
