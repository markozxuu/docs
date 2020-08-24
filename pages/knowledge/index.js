import formatDate from 'date-fns/format'

import Head from '~/components/layout/head'
import Wrapper from '~/components/layout/wrapper'
import { H1, H3, P } from '~/components/text'
import Link from '~/components/text/link'
import Button from '~/components/buttons'
import { PRODUCT_NAME } from '~/lib/constants'
import Footer from '~/components/footer'

import { getAllKnowledgeArticles } from '~/lib/data/datocms'

const Knowledge = ({ articles }) => (
  <>
    <Head
      titlePrefix=""
      titleSuffix=""
      title={`${PRODUCT_NAME} Knowledge`}
      description={`Learn how to quickly deploy with ${PRODUCT_NAME} in any situation.`}
    />

    <div className="knowledge">
      <div className="knowledge-heading">
        <Wrapper>
          <H1>Knowledge Base</H1>
          <P>
            A collection of knowledge for using the {PRODUCT_NAME} platform.
          </P>

          <div className="actions">
            <span className="caption">Sorted by Published Date</span>
            <Link
              href="https://github.com/vercel/docs/issues/new?labels=Section%3A+Knowledge"
              underlineOnHover={false}
            >
              <Button type="secondary" small>
                Request an Article
              </Button>
            </Link>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="knowledge-list">
          {articles.map((article, i) => (
            <Link
              href="/knowledge/[slug]"
              as={`/knowledge/${article.slug}`}
              key={`${article.slug}.${i}`}
            >
              <article className="article">
                <div className="titles">
                  <H3>{article.title}</H3>
                  <P style={{ color: '#444' }}>{article.description}</P>
                </div>
                <div className="meta">
                  <span className="date">
                    {article._firstPublishedAt === article._publishedAt
                      ? `Published at ${formatDate(
                          article._firstPublishedAt,
                          'MMMM Do YYYY'
                        )}`
                      : `Revised at ${formatDate(
                          article._publishedAt,
                          'MMMM Do YYYY'
                        )}`}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Wrapper>
    </div>

    <Footer />

    <style jsx>{`
      .titles {
        margin-right: var(--geist-gap);
        flex: 4;
      }

      .knowledge {
        min-height: 100vh;
        padding-bottom: 64px;
      }

      .knowledge :global(span a) {
        width: 100%;
      }

      .knowledge-heading {
        border-bottom: 1px solid #eaeaea;
        padding-top: 48px;
        padding-bottom: 16px;
      }

      .knowledge-heading :global(h1) {
        margin-bottom: 8px;
      }

      .knowledge-heading :global(p) {
        font-size: 16px;
        margin-top: 8px;
        color: #444444;
      }

      .actions {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .actions .caption {
        text-transform: uppercase;
        color: #666;
        font-size: 12px;
        margin-right: 5px;
      }

      .knowledge-list {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 8px;
      }

      .knowledge-list > :global(a) > .article {
        border-bottom: 1px solid #eaeaea;
      }

      .knowledge-list :global(a):hover {
        text-decoration: none;
      }

      .article {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 24px 0;
        position: relative;
        color: #000;
      }

      .article :global(h3) {
        color: #000;
        margin: 0;
        padding-right: 64px;
      }

      .article :global(p) {
        margin-bottom: 0;
        color: #222;
        padding-right: 64px;
      }

      .article :global(.avatar-group) {
        width: auto;
      }

      .article:hover :global(h4) {
        text-decoration: underline;
      }

      .article.contribute {
        margin-top: 24px;
      }

      .article.contribute :global(h4) {
      }

      .article.contribute :global(p) {
      }

      .article.contribute .meta .avatar {
        width: 24px;
        height: 24px;
        background: #000;
        border-radius: 50%;
        text-transform: uppercase;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 8px;
        font-weight: 700;
        color: white;
      }

      .meta {
        display: flex;
        flex: 1;
        flex-direction: column-reverse;
        justify-content: space-between;
        align-items: flex-end;
      }

      .date {
        color: #666;
        font-size: var(--font-size-small);
        line-height: var(--line-height-primary);
        margin-bottom: 2px;
        font-size: 0.8em;
      }

      @media (max-width: 768px) {
        .article {
          flex-direction: column;
        }

        .article :global(p) {
          padding-right: 0;
        }

        .meta {
          flex-direction: row;
          margin-top: 24px;
        }
      }
    `}</style>
  </>
)

export default Knowledge

export async function getStaticProps() {
  const articles = await getAllKnowledgeArticles({ first: 100 })

  return {
    props: {
      articles,
    },
    revalidate: 5,
  }
}

export const config = {
  amp: 'hybrid',
}
