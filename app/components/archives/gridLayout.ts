import type { GridSpanSize } from './types';

export const ARCHIVE_GRID_LAYOUTS: Record<
  GridSpanSize,
  { aspect: string; span: string }
> = {
  standard: { aspect: 'aspect-square', span: 'col-span-1' },
  portrait: { aspect: 'aspect-[1/2]', span: 'col-span-1 row-span-2' },
  wide: { aspect: 'aspect-[2/1]', span: 'col-span-2 md:col-span-2' },
  featured: {
    aspect: 'aspect-square',
    span: 'col-span-2 md:col-span-2 md:row-span-2',
  },
};

export const getArchiveGridLayout = (gridSize?: string) => {
  if (gridSize && gridSize in ARCHIVE_GRID_LAYOUTS) {
    return ARCHIVE_GRID_LAYOUTS[gridSize as GridSpanSize];
  }

  return ARCHIVE_GRID_LAYOUTS.standard;
};
