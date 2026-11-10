import {
  DocumentTextIcon,
  UsersIcon,
  EyeOpenIcon,
  DocumentVideoIcon,
  AddDocumentIcon,
} from '@sanity/icons';
import { CiMusicNote1 } from 'react-icons/ci';
import { MdOutlineSportsSoccer, MdOutlinePodcasts } from 'react-icons/md';
import { IoNewspaperOutline } from 'react-icons/io5';
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('textBlock')
        .title('Text Block')
        .icon(DocumentTextIcon),
      S.documentTypeListItem('managementCard')
        .title('Management Card')
        .icon(UsersIcon),
      S.documentTypeListItem('announcement')
        .title('Announcement')
        .icon(EyeOpenIcon),
      S.documentTypeListItem('videoCard')
        .title('Video Card')
        .icon(DocumentVideoIcon),
      S.documentTypeListItem('podcast')
        .title('Podcast')
        .icon(MdOutlinePodcasts),
      S.documentTypeListItem('footer').title('Footer'),
      S.listItem()
        .title('Archives')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Archive Content')
            .items([
              S.documentTypeListItem('collectionHighlight').title(
                'Collection Highlights',
              ),
              S.documentTypeListItem('profile').title('Profiles'),
              S.documentTypeListItem('archiveNews').title('Archive News'),
              S.documentTypeListItem('photo').title('Photos'),
              S.documentTypeListItem('recentBand').title('Recent Bands'),
            ]),
        ),
      S.listItem()
        .title('Articles')
        .icon(AddDocumentIcon)
        .child(
          S.list()
            .title('Articles by Type')
            .items([
              S.listItem()
                .title('Music Articles')
                .icon(CiMusicNote1)
                .child(
                  S.documentList()
                    .title('Music Articles')
                    .filter('_type == "article" && articleType == "music"')
                    .defaultOrdering([
                      { field: '_createdAt', direction: 'desc' },
                    ]),
                ),
              S.listItem()
                .title('News Articles')
                .icon(IoNewspaperOutline)
                .child(
                  S.documentList()
                    .title('News Articles')
                    .filter('_type == "article" && articleType == "news"')
                    .defaultOrdering([
                      { field: '_createdAt', direction: 'desc' },
                    ]),
                ),
              S.listItem()
                .title('Sports Articles')
                .icon(MdOutlineSportsSoccer)
                .child(
                  S.documentList()
                    .title('Sports Articles')
                    .filter('_type == "article" && articleType == "sports"')
                    .defaultOrdering([
                      { field: '_createdAt', direction: 'desc' },
                    ]),
                ),
            ]),
        ),
    ]);
