import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useState, useEffect } from "react";

interface SpotlightSearchProps {
  open: boolean;
  onClose: () => void;
}

const SpotlightSearch = ({ open, onClose }: SpotlightSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic
    // For now, just a placeholder
    if (query.trim()) {
      setResults([
        { id: 1, title: "Example Result 1", type: "page" },
        { id: 2, title: "Example Result 2", type: "document" },
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
          variant="outlined"
        />
        <List>
          {results.map((result) => (
            <ListItem key={result.id} disablePadding>
              <ListItemButton onClick={onClose}>
                <ListItemText primary={result.title} secondary={result.type} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SpotlightSearch;
