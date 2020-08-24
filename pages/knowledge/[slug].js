import Layout from '~/components/layout/knowledge'
import { queryDatoCMS, getKnowledgeArticleBySlug } from '~/lib/data/datocms'

export default ({ article }) => <Layout article={article} />

export async function getStaticProps({ params: { slug } }) {
  const article = await getKnowledgeArticleBySlug(slug)

  return {
    props: { article },
    revalidate: 5,
  }
}

export async function getStaticPaths() {
  const res = await queryDatoCMS({
    query: `{
      articles: allKnowledgeBases(first: 100, orderBy: _publishedAt_DESC) {
        title
        slug
        description
        authors {
          slug
          isMemberOfVercelTeam
          profilePicture {
            url
          }
        }
        _publishedAt
        _updatedAt
      }
    }`,
  })
  const articles = res.articles

  //console.log('articles', articles);

  // Get the paths we want to pre-render based on articles
  const paths = articles.map((article) => `/knowledge/${article.slug}`)

  // TODO: add support for previews

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.

  return { paths, fallback: true }
}

export const config = {
  amp: 'hybrid',
}
