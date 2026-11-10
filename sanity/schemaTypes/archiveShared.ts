import { defineArrayMember, defineField, defineType } from 'sanity';
import type { SlugIsUniqueValidator } from 'sanity';

const ARCHIVE_DOCUMENT_TYPES = [
  'collectionHighlight',
  'profile',
  'archiveNews',
  'photo',
];

export const isUniqueArchiveSlug: SlugIsUniqueValidator = async (
  slug,
  context,
) => {
  const publishedId = context.document?._id?.replace(/^drafts\./, '');

  if (!publishedId) return true;

  return context.getClient({ apiVersion: '2024-07-24' }).fetch<boolean>(
    `!defined(*[
        _type in $types &&
        slug.current == $slug &&
        !(_id in [$publishedId, $draftId])
      ][0]._id)`,
    {
      types: ARCHIVE_DOCUMENT_TYPES,
      slug,
      publishedId,
      draftId: `drafts.${publishedId}`,
    },
  );
};

export const defineArchiveSlugField = (source: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: {
      source,
      maxLength: 96,
      isUnique: isUniqueArchiveSlug,
    },
    validation: (Rule) => Rule.required(),
  });

export const archiveImageField = defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
    }),
  ],
  validation: (Rule) => Rule.required(),
});

export const defineWrittenArchiveType = (
  name: 'collectionHighlight' | 'profile',
  title: string,
) =>
  defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'subject',
        title: 'Subject',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineArchiveSlugField('subject'),
      defineField({
        name: 'writer',
        title: 'Writer',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'publicationDate',
        title: 'Publication Date',
        type: 'date',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'array',
        of: [defineArrayMember({ type: 'block' })],
        validation: (Rule) => Rule.required().min(1),
      }),
      defineField({
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'image',
            options: { hotspot: true },
            fields: [
              defineField({
                name: 'alt',
                title: 'Alternative Text',
                type: 'string',
              }),
            ],
          }),
        ],
        validation: (Rule) => Rule.required().min(1),
      }),
    ],
    preview: {
      select: {
        title: 'subject',
        subtitle: 'writer',
        media: 'images.0',
      },
    },
  });
