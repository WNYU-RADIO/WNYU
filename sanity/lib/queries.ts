import { groq } from 'next-sanity';

export const MANAGEMENT_CARDS_QUERY = groq`*[_type=="managementCard"]|order(priority asc){'id':_id,name,role,email,picture}`;

export const ABOUT_TEXT_QUERY = groq`*[_type=="textBlock" && name=="About"][0]{content}`;

export const ANNOUNCEMENTS_QUERY = groq`*[_type=="announcement"]|order(_createdAt desc){'id':_id,title,subtitle,announcementImage,link}`;

export const ARCHIVE_ITEMS_QUERY = groq`
  *[
    _type in ["collectionHighlight", "profile", "archiveNews", "photo"] &&
    defined(slug.current) &&
    select(
      _type in ["collectionHighlight", "profile"] => defined(images[0].asset),
      _type in ["archiveNews", "photo"] => defined(image.asset),
      false
    )
  ] | order(coalesce(publicationDate, _createdAt) desc) {
    "id": _id,
    "slug": coalesce(slug.current, ""),
    "title": select(
      _type == "collectionHighlight" => coalesce(subject, "Untitled"),
      _type == "profile" => coalesce(subject, "Untitled"),
      _type == "archiveNews" => coalesce(headline, "Untitled"),
      _type == "photo" => coalesce(title, "Untitled"),
      "Untitled"
    ),
    "date": coalesce(publicationDate, ""),
    "category": select(
      _type == "collectionHighlight" => "Collection Highlights",
      _type == "profile" => "Profiles",
      _type == "archiveNews" => "News",
      _type == "photo" => "Photos"
    ),
    "imageUrl": select(
      _type in ["collectionHighlight", "profile"] => coalesce(images[0].asset->url, "/placeholder.png"),
      coalesce(image.asset->url, "/placeholder.png")
    ),
    "imageAlt": select(
      _type in ["collectionHighlight", "profile"] => coalesce(images[0].alt, subject, "Archive image"),
      coalesce(image.alt, title, headline, "Archive image")
    ),
    "callNumber": select(
      _type == "photo" => coalesce(callNumber, title, ""),
      null
    ),
    "gridSize": select(
      _type == "collectionHighlight" => "featured",
      "standard"
    )
  }
`;

export const HOME_RECENT_BANDS_QUERY = groq`
  *[
    _type == "recentBand" &&
    defined(image.asset)
  ]
  | order(_createdAt desc)[0...7] {
    "id": _id,
    "imageUrl": coalesce(image.asset->url, "/placeholder.png"),
    "imageAlt": coalesce(image.alt, "Recent band photo")
  }
`;

export const ARCHIVE_BY_SLUG_QUERY = groq`
  *[
    _type in ["collectionHighlight", "profile", "archiveNews", "photo"] &&
    slug.current == $slug &&
    defined(slug.current)
  ][0] {
    "documentType": _type,
    "title": select(
      _type == "collectionHighlight" => coalesce(subject, "Untitled"),
      _type == "profile" => coalesce(subject, "Untitled"),
      _type == "archiveNews" => coalesce(headline, "Untitled"),
      _type == "photo" => coalesce(title, "Untitled"),
      "Untitled"
    ),
    "date": coalesce(publicationDate, ""),
    "category": select(
      _type == "collectionHighlight" => "Collection Highlights",
      _type == "profile" => "Profiles",
      _type == "archiveNews" => "News",
      _type == "photo" => "Photos"
    ),
    "writer": select(
      _type in ["collectionHighlight", "profile"] => writer,
      null
    ),
    "portableDescription": select(
      _type in ["collectionHighlight", "profile"] => description,
      null
    ),
    "textDescription": select(
      _type == "archiveNews" => description,
      null
    ),
    "callNumber": select(
      _type == "photo" => coalesce(callNumber, title, ""),
      null
    ),
    "images": select(
      _type in ["collectionHighlight", "profile"] => coalesce(
        images[defined(asset)]{
          "url": coalesce(asset->url, "/placeholder.png"),
          "alt": coalesce(alt, ^.subject, "Archive image")
        },
        []
      ),
      _type in ["archiveNews", "photo"] => [{
        "url": coalesce(image.asset->url, "/placeholder.png"),
        "alt": coalesce(image.alt, select(
          _type == "archiveNews" => headline,
          title
        ), "Archive image")
      }],
      []
    )
  }
`;

export const VIDEO_CARDS_QUERY = groq`*[_type=="videoCard"]|order(_createdAt desc){'id':_id,name,videoLink}`;

export const ARTICLES_QUERY = groq`
  *[_type == "article"]
  | order(_createdAt desc) | order(priority asc){
    'id': _id,
    name,
    slug,
    author,
    date,
    picture,
    content,
    articleType
  }
`;

export const ARTICLES_BY_TYPE_QUERY = groq`
  *[_type == "article" && articleType == $type]
  | order(_createdAt desc) | order(priority asc) {
    'id': _id,
    name,
    slug,
    author,
    date,
    picture,
    content,
    articleType
  }
`;

export const ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "article" && slug.current == $slug][0]{
    'id': _id,
    name,
    slug,
    author,
    date,
    picture,
    content,
    articleType
  }
`;

export const PODCASTS_QUERY = groq`
  *[_type == "podcast"]| order(_createdAt desc){
    'id': _id,
    name,
    slug,
    host,
    picture,
    spotifyEpisodeURLs,
    department,
    description
  }
`;

export const PODCASTS_BY_DEPARTMENT_QUERY = groq`
  *[_type == "podcast" && department == $department]
  | order(_createdAt desc) {
     'id': _id,
    name,
    slug,
    host,
    picture,
    spotifyEpisodeURLs,
    department,
    description
  }
`;

export const PODCAST_BY_SLUG_QUERY = groq`
  *[_type == "podcast" && slug.current == $slug][0]{
     'id': _id,
    name,
    slug,
    host,
    picture,
    spotifyEpisodeURLs,
    department,
    description
  }
`;

export const FOOTER_QUERY = groq`
  *[_type == "footer"][0]{
    'id': _id,
    blockText,
    footerImage,
    socials
  }
`;
