import { defineField, defineType } from 'sanity';
import { archiveImageField, defineArchiveSlugField } from './archiveShared';

export const archiveNewsType = defineType({
  name: 'archiveNews',
  title: 'Archive News',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineArchiveSlugField('headline'),
    defineField({
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 8,
      validation: (Rule) => Rule.required(),
    }),
    archiveImageField,
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'publicationDate',
      media: 'image',
    },
  },
});
