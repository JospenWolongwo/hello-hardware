export interface FlattenStore {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  parent: string | null;
  branches: string[];
}
