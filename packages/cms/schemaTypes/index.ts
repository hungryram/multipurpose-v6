import {profileType} from './documents/profileType'
import {appearanceType} from './documents/appearanceType'
import {homeType} from './documents/homeType'
import {pageType} from './documents/pageType'
import {blogPostType} from './documents/blogPostType'
import {heroBlockType} from './pagebuilder/heroBlockType'
import {contentBlockType} from './pagebuilder/contentBlockType'
import {contentBlockType as contentType} from './util/contentBlockType'
import {blockLayoutType} from './util/blockLayoutType'
import {buttonItemType} from './util/buttonItemType'
import {buttonsType} from './util/buttonsType'
import {featureGridBlockType} from './pagebuilder/featureGridBlockType'
import {blogPostsBlockType} from './pagebuilder/blogPostsBlockType'
import {contactFormBlockType} from './pagebuilder/contactFormBlockType'
import {accordionBlockType} from './pagebuilder/accordionBlockType'
import {imageBlockType} from './pagebuilder/imageBlockType'

export const schemaTypes = [
  homeType,
  pageType,
  blogPostType,
  profileType,
  appearanceType,
  contentType,
  blockLayoutType,
  buttonItemType,
  buttonsType,
  heroBlockType,
  contentBlockType,
  featureGridBlockType,
  blogPostsBlockType,
  contactFormBlockType,
  accordionBlockType,
  imageBlockType,
]
