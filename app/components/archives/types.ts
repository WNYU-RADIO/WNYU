import type { ARCHIVE_ITEMS_QUERYResult } from '@/sanity.types';

export type ArchiveItem = ARCHIVE_ITEMS_QUERYResult[number];
export type ArchiveCategory = ArchiveItem['category'];
export type GridSpanSize = 'standard' | 'portrait' | 'wide' | 'featured';
