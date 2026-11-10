import { defineType } from 'sanity';
import { archiveImageField } from './archiveShared';

export const recentBandType = defineType({
  name: 'recentBand',
  title: 'Recent Band',
  type: 'document',
  fields: [archiveImageField],
  preview: {
    select: {
      media: 'image',
    },
    prepare({ media }) {
      // Sanity types selected preview values as `any`.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return { title: 'Recent Band', media };
    },
  },
});
