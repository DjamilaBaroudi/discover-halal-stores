export interface HalalStore {
  id: string;
  name: string;
  address: string;
  neighborhood?: string;
  category?: string;
  image_url: string;
  distance?: number;
  tel?: string;
  website?: string;
  averageRating?: number;
  rating?: number;
  recordId?: string;
}
