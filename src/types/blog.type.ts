export type TBlog = {
  _id: string;
  imageUrl: string;
  title: string;
  slug: string;
  overview: string;
  category: string;
  description: string;
  isFeatured?: boolean;
  timeToRead: string;
  tags : string[];
  createdAt: string;
  updatedAt?: string;
};