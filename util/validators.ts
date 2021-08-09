import greyMatter from 'gray-matter'

import AuthorCollection from '../interfaces/AuthorCollection'
import FrontMatter from '../interfaces/FrontMatter'
import RecordCollectionDefinition from '../interfaces/RecordCollectionDefinition'

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => isString(item))
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export function normalizeStringArray(rawItems: unknown): string[] {
    if (!rawItems) {
        return []
    }
    if (isString(rawItems)) {
        return [rawItems.trim().toLowerCase()]
    }
    if (isStringArray(rawItems)) {
        return rawItems.map(item => item.trim().toLowerCase())
    }
    throw new Error('Items must be an array of strings.')
}

export function normalizeString(rawString: unknown): string {
    if (isString(rawString)) {
        return rawString.trim()
    } 
    throw new Error('Front-matter: Value must be a string.')
}

export function normalizeFrontMatter(rawFrontMatter: ReturnType<typeof greyMatter>['data']): FrontMatter {
    return {
        title: normalizeString(rawFrontMatter.title) ?? normalizeString(rawFrontMatter.alternateTitle) ?? 'Untitled Document',
        alternateTitle: rawFrontMatter.alternateTitle ? normalizeString(rawFrontMatter.alternateTitle) : null,
        tags: normalizeStringArray(rawFrontMatter.tags),
        published: isBoolean(rawFrontMatter.published) ? rawFrontMatter.published : true,
        unlisted: isBoolean(rawFrontMatter.unlisted) ? rawFrontMatter.unlisted : false,
        author: rawFrontMatter.author ? normalizeString(rawFrontMatter.author) : null,
        image: rawFrontMatter.image ? normalizeString(rawFrontMatter.image) : null,
        imageAlt: rawFrontMatter.imageAlt ? normalizeString(rawFrontMatter.imageAlt) : null,
        socialImage: rawFrontMatter.socialImage ? normalizeString(rawFrontMatter.socialImage) : null,
        description: rawFrontMatter.description ? normalizeString(rawFrontMatter.description) : null,
        type: normalizeString(rawFrontMatter.type)
    }
}

export function normalizeRecordCollectionDefinition(collection: RecordCollectionDefinition): RecordCollectionDefinition {
    return {
        title: normalizeString(collection.title),
        slug: normalizeString(collection.slug),
        type: normalizeString(collection.type),
        members: normalizeStringArray(collection.members)
    }
}

export function normalizeAuthorCollectionDefinition(author: AuthorCollection): AuthorCollection {
    return {
        id: normalizeString(author.id),
        name: normalizeString(author.name),
        bio: author.bio ? normalizeString(author.bio) : null,
        socialLinks: author.socialLinks ? normalizeStringArray(author.socialLinks) : null
    }
}