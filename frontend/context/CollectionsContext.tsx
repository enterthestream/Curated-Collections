import { Collection } from "@/types.ts/collection";
import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserCollections } from "@/api/backendFunctions";

type CollectionsContextType = {
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<any[]>>;
  isLoadingCollections: boolean;
  refreshCollections: () => Promise<void>;
};

const CollectionsContext = createContext<CollectionsContextType | undefined>(
  undefined
);

type CollectionsProviderProps = {
  children: ReactNode;
  userId: string;
};

export function CollectionsContextProvider({
  children,
  userId,
}: CollectionsProviderProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);

  async function fetchUserCollections() {
    try {
      setIsLoadingCollections(true);
      const fetchedCollections = await getUserCollections();
      setCollections(fetchedCollections || []);
      setIsLoadingCollections(false);
    } catch (err) {
      console.error("Error fetching user collections", err);
      setIsLoadingCollections(false);
    }
  }

  useEffect(() => {
    console.log("Component mounted");
    fetchUserCollections();
  }, []);

  const refreshCollections = async () => {
    await fetchUserCollections();
  };

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        setCollections,
        isLoadingCollections,
        refreshCollections,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

import { useContext } from "react";

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error(
      "useCollections must be used within a CollectionContextProvider"
    );
  }
  return context;
}
