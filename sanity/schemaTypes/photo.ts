import { defineField, defineType } from 'sanity';
import { archiveImageField, defineArchiveSlugField } from './archiveShared';

export const photoType = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineArchiveSlugField('title'),
    defineField({
      name: 'callNumber',
      title: 'Call Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    archiveImageField,
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
});
