import Layout from '~/components/layout/knowledge'
import {
  getKnowledgeArticleBySlug,
  getKnowledgeArticleById,
} from '~/lib/data/datocms'

export default (props) => <Layout {...props} preview={true} />

export async function getServerSideProps({ res, query, params: { slug } }) {
  const article = await getKnowledgeArticleBySlug(slug, true)

  if (article === null || article.id !== query.id) {
    // if query.id is different to article.id, we will make the best effort to redirect back to /knowledge/${query.slug}, the slug might not exist -> 404

    res.setHeader('location', `/knowledge/${slug}`)
    res.statusCode = 307
    res.end()
  } else {
    const publishedArticle = await getKnowledgeArticleById(article.id, false)

    if (article._status !== 'draft' && article._status !== 'updated') {
      // no updates

      // NOTE: since the slug of published article might be different to the preview article, once the preview article is located, we should use the article.id as key to retrieve the published article.

      if (publishedArticle !== null) {
        res.setHeader('location', `/knowledge/${publishedArticle.slug}`)
      } else {
        res.setHeader('location', `/knowledge/${article.slug}`)
      }

      res.statusCode = 307
      res.end()
    } else {
      return {
        props: {
          article,
          publishedArticle,
        },
      }
    }

    return {
      props: {},
    }
  }
}
