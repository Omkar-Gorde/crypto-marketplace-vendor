
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  owner: string;
  purchased: boolean;
};

export type MarketplaceState = {
  products: Product[];
  loading: boolean;
  account: string | null;
}
