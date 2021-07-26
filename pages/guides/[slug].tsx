import { GetStaticPaths, GetStaticProps } from 'next'

import Article, { Props as ArticleProps } from '../../components/Article'
import getQueryParameter from '../../util/getQueryParameters'
import loadAllRecords from '../../util/loadAllRecords'
import loadCollections from '../../util/loadCollections'
import loadMarkdownFile from '../../util/loadMarkdownFile'
import omitUndefinedFields from '../../util/omitUndefinedFields'
import serializeMdxSource from '../../util/serializeMdxSource'
import slugToTitleCase from '../../util/slugToTitleCase'

export const getStaticPaths: GetStaticPaths = async () => {
    const guides = await loadAllRecords('guides', true)
    const paths = guides.map(guide => ({ params: { slug: guide.slug } }))
    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<ArticleProps> = async context => {
    const slug = getQueryParameter(context.params, 'slug')
    const baseDirectory = 'guides'
    const markdownFile = await loadMarkdownFile(baseDirectory, `${slug}.md`)
    const { serializeResult, toc } = await serializeMdxSource(markdownFile)
    const recordAuthor = markdownFile.frontMatter.author ? slugToTitleCase(markdownFile.frontMatter.author) : ''
    return {
        props: omitUndefinedFields({
            title: markdownFile.frontMatter.title,
            alternateTitle: markdownFile.frontMatter.alternateTitle,
            author: recordAuthor,
            tags: markdownFile.frontMatter.tags,
            image: markdownFile.frontMatter.image,
            socialImage: markdownFile.frontMatter.socialImage,
            description: markdownFile.frontMatter.description,
            toc,
            mdxSource: serializeResult,
            slug,
        }),
    }
}

export default Article