import {
  announcementType,
  archiveNewsType,
  articleType,
  collectionHighlightType,
  footerType,
  managementCardType,
  photoType,
  podcastType,
  profileType,
  recentBandType,
  textBlockType,
  videoCardType,
} from './schemaTypes';
import type { SchemaTypeDefinition } from 'sanity';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    textBlockType,
    managementCardType,
    announcementType,
    collectionHighlightType,
    profileType,
    archiveNewsType,
    photoType,
    recentBandType,
    videoCardType,
    articleType,
    podcastType,
    footerType,
  ],
};
