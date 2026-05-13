import {defineQuery} from 'next-sanity'

const navItemFields = `
	label,
	openInNewTab,
	url,
	"pageType": page->_type,
	"slug": page->slug.current,
	submenuItems[]{
		label,
		openInNewTab,
		url,
		"pageType": page->_type,
		"slug": page->slug.current
	}
`

const imageFields = `
	alt,
	"assetAltText": asset->altText,
	asset
`

const sharedLayoutFields = `
	containerWidth,
	textAlign,
	paddingTop,
	paddingBottom,
	customPaddingTop,
	customPaddingBottom,
	marginTop,
	marginBottom,
	customMarginTop,
	customMarginBottom,
	backgroundType,
	backgroundColor,
	backgroundOverlayColor,
	backgroundImage{${imageFields}}
`

const sharedButtonFields = `
	_key,
	label,
	href,
	openInNewTab,
	style,
	"pageType": page->_type,
	"slug": page->slug.current
`

const sharedBlocksFields = `
	_key,
	_type,
	layout{
		${sharedLayoutFields}
	},
	buttons[]{
		${sharedButtonFields}
	},
	_type == "heroBlock" => {
		content,
		image{${imageFields}},
		imageOverlayColor,
		heroHeight,
		customHeroHeight,
		imageDisplayMode
	},
	_type == "contentBlock" => {
		content,
		contentLayoutType,
		image{${imageFields}}
	},
	_type == "featureGridBlock" => {
		content,
		featureGridLayoutType,
		gridColumns,
		items[]{
			_key,
			content,
			image{${imageFields}},
			button{
				${sharedButtonFields}
			}
		}
	},
	_type == "blogPostsBlock" => {
		content,
		postCount,
		showFeaturedImage,
		showExcerpt,
		showAuthor,
		showPublishedDate,
		"posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc)[0...12]{
			_key,
			title,
			"slug": slug.current,
			excerpt,
			authorName,
			publishedAt,
			featuredImage{${imageFields}}
		}
	},
	_type == "accordionBlock" => {
		content,
		questionColor,
		contentColor,
		faqSchemaEnabled,
		items[]{
			_key,
			question,
			content
		}
	},
	_type == "contactFormBlock" => {
		content,
		submitLabel,
		successMessage,
		errorMessage,
		"successRedirectPath": select(
			defined(successRedirectPage) && successRedirectPage->_type == "home" => "/",
			defined(successRedirectPage->slug.current) => "/" + successRedirectPage->slug.current,
			null
		),
		destinationEmail,
		postmarkFromEmail,
		postmarkFromName,
		postmarkSubject,
		sheetsSheetId,
		sheetsSheetName,
		formFields[]{
			_key,
			name,
			label,
			fieldType,
			required,
			placeholder,
			helpText,
			width,
			options
		}
	},
	_type == "imageBlock" => {
		image{${imageFields}}
	}
`

const sharedPageFields = `
	title,
	slug,
	seoTitle,
	seoDescription,
	blocks[]{
		${sharedBlocksFields}
	}
`

function buildAppearancePageQuery(homeProjection: string) {
	return defineQuery(`
*[_type == "appearance"] | order(_updatedAt desc)[0]{
	"profile": *[_type == "profile"] | order(_updatedAt desc)[0]{
		companyName,
		websiteUrl
	},
	headerContainerWidth,
	headerLogoSize,
	headerLogo{${imageFields}},
	headerNavigation[]{
		${navItemFields}
	},
	footerDisclaimer,
	footerContainerWidth,
	footerNavigation[]{
		${navItemFields}
	},
	"home": ${homeProjection}{
		${sharedPageFields}
	}
}
`)
}

export const homePageQuery = buildAppearancePageQuery('activeHomePage->')

export const pageBySlugQuery = buildAppearancePageQuery('*[_type == "page" && slug.current == $slug][0]')

const sharedAppearanceFields = `
	"profile": *[_type == "profile"] | order(_updatedAt desc)[0]{
		companyName,
		websiteUrl
	},
	headerContainerWidth,
	headerLogoSize,
	headerLogo{${imageFields}},
	headerNavigation[]{
		${navItemFields}
	},
	footerDisclaimer,
	footerContainerWidth,
	footerNavigation[]{
		${navItemFields}
	}
`

export const blogListQuery = defineQuery(`
*[_type == "appearance"] | order(_updatedAt desc)[0]{
	${sharedAppearanceFields},
	"posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
		_key,
		title,
		"slug": slug.current,
		excerpt,
		authorName,
		publishedAt,
		seoTitle,
		seoDescription,
		featuredImage{${imageFields}}
	}
}
`)

export const blogPostBySlugQuery = defineQuery(`
*[_type == "appearance"] | order(_updatedAt desc)[0]{
	${sharedAppearanceFields},
	"post": *[_type == "blogPost" && slug.current == $slug][0]{
		title,
		"slug": slug.current,
		excerpt,
		authorName,
		publishedAt,
		_updatedAt,
		seoTitle,
		seoDescription,
		featuredImage{${imageFields}},
		content
	}
}
`)

export const blogPostSlugsQuery = defineQuery(`
*[_type == "blogPost" && defined(slug.current)][]{
	"slug": slug.current,
	publishedAt,
	_updatedAt
}
`)

export const siteChromeQuery = defineQuery(`
*[_type == "appearance"] | order(_updatedAt desc)[0]{
	${sharedAppearanceFields}
}
`)

export const siteProfileQuery = defineQuery(`
*[_type == "profile"] | order(_updatedAt desc)[0]{
	companyName,
	websiteUrl,
	contactEmail,
	contactPhone,
	address,
	city,
	state,
	zip
}
`)

export const pageSlugsQuery = defineQuery(`
*[_type == "page" && defined(slug.current)][]{
	"slug": slug.current
}
`)
