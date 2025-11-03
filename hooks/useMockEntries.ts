import { useEffect, useState } from 'react';
import { mockEntries } from '../mock/mockEntries';
import { Entry } from '../src/types';

// Control whether to use mock data
const USE_MOCK = true;

export function useMockEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (USE_MOCK) {
      setEntries(mockEntries);
    } else {
      // Replace with your real data source
      // For example, fetch from localStorage:
      // const storedEntries = EntryStorage.getAllEntries()
      // setEntries(storedEntries)
      setEntries([]);
    }
  }, []);

  return entries;
}

