
import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-sm items-center">
      <Input
        type="search"
        placeholder="Search items..."
        className="search-input pl-10 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Button 
        type="submit" 
        variant="ghost" 
        className="absolute right-0 top-0 h-full px-3"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
