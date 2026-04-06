import { houseSchema } from './house'
import { siteConfigSchema } from './siteConfig'
import { homepageSchema } from './homepage'
import { galleryAlbumSchema } from './galleryAlbum'
import { servicesSchema } from './services'

export const schemaTypes = [
  siteConfigSchema,
  homepageSchema,
  servicesSchema,
  houseSchema,
  galleryAlbumSchema,
]
