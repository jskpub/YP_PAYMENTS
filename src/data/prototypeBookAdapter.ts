import { Book } from '../types';
import { RECOMMENDED_BOOKS } from '../prototype/data/mockData';

export const PROTOTYPE_RECOMMENDED_BOOKS: Book[] = RECOMMENDED_BOOKS.map((book) => ({
  id: book.id,
  title: book.title,
  subtitle: book.subtitle,
  author: book.author,
  publisher: book.publisher,
  publishDate: book.publishDate,
  coverImage: book.coverImage || '',
  listPrice: book.originalPrice,
  sellingPrice: book.salePrice,
  discountRate: book.discountRate,
  rewardPoint: book.pointReward,
  format: 'paper',
  bookType: 'recommended',
  tags: book.tags || [],
  description: book.description,
  rating: book.rating,
  reviewCount: book.reviewsCount,
}));
