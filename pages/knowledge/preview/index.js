import formatDate from 'date-fns/format'
import cn from 'classnames'
import Head from '~/components/layout/head'
import Wrapper from '~/components/layout/wrapper'
import { H1, H3, P } from '~/components/text'
import Link from '~/components/text/link'
import { LinkList } from '~/components/list'
import Button from '~/components/buttons'
import { PRODUCT_NAME } from '~/lib/constants'
import Footer from '~/components/footer'
import { UserContext } from '~/lib/user-context'
import UseTeamInfo from '~/lib/use-team-info'
import { getAllKnowledgeArticles } from '~/lib/data/datocms'

const Knowledge = ({ articles, previewArticles }) => (
  <>
    <Head
      titlePrefix="[PREVIEW] "
      titleSuffix=""
      title={`${PRODUCT_NAME} Knowledge`}
      description={`Learn how to quickly deploy with ${PRODUCT_NAME} in any situation.`}
      noIndex={true}
    />

    <>
      <UserContext.Consumer>
        {({ user, userLoaded }) => (
          <UseTeamInfo
            user={user}
            render={({ teams, teamsLoaded }) => {
              const isInVercelTeam =
                teams.findIndex((team) => team.teamSlug === 'vercel') !== -1

              return !userLoaded || (user && !teamsLoaded) ? (
                <div className="message">Loading...</div>
              ) : !user ? (
                <div className="message">
                  You do not have permission to access.
                  <LinkList>
                    <Link href="/login?next=%2Fknowledge%2Fpreview">Login</Link>
                    <Link href="/docs">Docs</Link>
                    <Link href="/guides">Guides</Link>
                    <Link href="/knowledge">Knowledge</Link>
                    <Link href="/blog">Blog</Link>
                  </LinkList>
                </div>
              ) : !isInVercelTeam ? (
                <div className="message">
                  You do not have permission to access.
                  <LinkList>
                    <Link href="/docs">Docs</Link>
                    <Link href="/guides">Guides</Link>
                    <Link href="/knowledge">Knowledge</Link>
                    <Link href="/blog">Blog</Link>
                  </LinkList>
                </div>
              ) : (
                <>
                  <header className="preview-heading">
                    <Wrapper>
                      <div>
                        You are currently viewing the{' '}
                        <span className="version">preview version</span> of{' '}
                        <i>
                          <strong>Knowledge Base</strong>
                        </i>{' '}
                        listing.
                      </div>
                      <div>
                        The <span className="version">published version</span>{' '}
                        of this listing can be accessed{' '}
                        <Link href="/knowledge">
                          <b>here</b>
                        </Link>
                        .
                      </div>
                    </Wrapper>
                  </header>
                  <div className="knowledge">
                    <div className="knowledge-heading">
                      <Wrapper>
                        <H1>Knowledge Base</H1>
                        <P>
                          A collection of knowledge for using the {PRODUCT_NAME}{' '}
                          platform.
                        </P>

                        <div className="actions">
                          <span className="caption">
                            Sorted by Published Date
                          </span>
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
                        {articles.map((article, i) => {
                          const previewArticle = previewArticles.find(
                            (p) => p.id === article.id && p._status !== 'draft'
                          )

                          const hasPreview = previewArticle !== undefined
                          const isDraft = article._status === 'draft'

                          const renderedArticle = hasPreview
                            ? previewArticle
                            : article

                          const href = isDraft
                            ? `/knowledge/preview/[slug]?id=${renderedArticle.id}`
                            : hasPreview
                            ? `/knowledge/preview/[slug]?id=${renderedArticle.id}`
                            : `/knowledge/[slug]`

                          const as =
                            isDraft || hasPreview
                              ? `/knowledge/preview/${renderedArticle.slug}?id=${renderedArticle.id}`
                              : `/knowledge/${renderedArticle.slug}`

                          return (
                            <Link
                              href={href}
                              as={as}
                              key={`${renderedArticle.slug}.${i}`}
                              title={
                                isDraft
                                  ? `Updated at ${formatDate(
                                      renderedArticle._updatedAt,
                                      'MMMM Do YYYY, HH:mm:ss'
                                    )}`
                                  : renderedArticle._firstPublishedAt ===
                                    renderedArticle._publishedAt
                                  ? `Published at ${formatDate(
                                      renderedArticle._firstPublishedAt,
                                      'MMMM Do YYYY, HH:mm:ss'
                                    )}`
                                  : `First published at ${formatDate(
                                      renderedArticle._firstPublishedAt,
                                      'MMMM Do YYYY, HH:mm:ss'
                                    )}, revised at ${formatDate(
                                      renderedArticle._publishedAt,
                                      'MMMM Do YYYY, HH:mm:ss'
                                    )}`
                              }
                            >
                              <article
                                className={cn('article', {
                                  'is-draft': isDraft,
                                  'has-preview': hasPreview,
                                })}
                              >
                                <div className="titles">
                                  <H3>
                                    {isDraft && (
                                      <div className="article-badge is-draft">
                                        draft
                                      </div>
                                    )}
                                    {hasPreview && (
                                      <div className="article-badge has-preview">
                                        preview
                                      </div>
                                    )}
                                    {renderedArticle.title}
                                  </H3>
                                  <P style={{ color: '#444' }}>
                                    {renderedArticle.description}
                                  </P>
                                </div>
                                <div className="meta">
                                  {isDraft ? (
                                    <span className="date">
                                      Updated at{' '}
                                      {formatDate(
                                        renderedArticle._updatedAt,
                                        'MMMM Do YYYY'
                                      )}
                                    </span>
                                  ) : (
                                    <span className="date">
                                      {renderedArticle._firstPublishedAt ===
                                      renderedArticle._publishedAt
                                        ? `Published at ${formatDate(
                                            renderedArticle._firstPublishedAt,
                                            'MMMM Do YYYY'
                                          )}`
                                        : `Revised at ${formatDate(
                                            renderedArticle._publishedAt,
                                            'MMMM Do YYYY'
                                          )}`}
                                    </span>
                                  )}
                                </div>
                              </article>
                            </Link>
                          )
                        })}
                      </div>
                    </Wrapper>
                  </div>
                </>
              )
            }}
          />
        )}
      </UserContext.Consumer>
      <Footer />
    </>

    <style jsx>{`
      .preview-heading {
        padding: 2rem 0;
        position: sticky;
        top: 4rem;
        z-index: 1;

        //background: #faf8c3CC;
        background: var(--geist-warning-light);
        opacity: 0.95;
      }

      .preview-heading div {
        margin-bottom: 0.5rem;
        font-size: 0.85em;
      }

      .preview-heading div .version {
        text-decoration: underline;
        cursor: pointer;
      }

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

      .article.has-preview {
      }

      .article.is-draft {
        opacity: 0.6;
      }

      .article .article-badge {
        display: inline-block;
        font-size: 0.6rem;
        position: relative;
        top: -0.3rem;
        margin-right: 0.6rem;
        margin-bottom: 0rem;
        border-radius: 0.2rem;
        padding: 0.2rem 0.5rem 0.15rem;
      }

      .article .article-badge.is-draft {
        background: var(--geist-foreground);
        color: var(--geist-background);
      }

      .article .article-badge.has-preview {
        background: var(--geist-highlight-magenta);
        color: var(--geist-background);
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

      .message {
        width: 100%;
        max-width: 900px;
        margin: 35vh auto 0;
        min-height: 30vh;
        text-align: center;
        font-size: 0.9rem;
      }

      .message :global(.link-list) {
        margin: 3rem auto;
        justify-content: center;
      }
    `}</style>
  </>
)

export default Knowledge

export async function getServerSideProps() {
  const publishedArticles = await getAllKnowledgeArticles({ first: 100 })

  const previewArticles = await getAllKnowledgeArticles({
    first: 100,
    filter: `{_status: {notIn: published}}`,
    preview: true,
  })

  const articles = []

  if (publishedArticles !== null) {
    publishedArticles.forEach((article) => articles.push(article))
  }

  if (previewArticles !== null) {
    // add drafts
    previewArticles.forEach((article) => {
      if (article._status === 'draft') {
        articles.push(article)
      }
    })
  }

  return {
    props: {
      articles: articles.sort((a, b) => {
        const timestampA =
          a._status === 'draft' ? a._updatedAt : a._firstPublishedAt

        const timestampB =
          b._status === 'draft' ? b._updatedAt : b._firstPublishedAt

        return timestampB < timestampA ? -1 : timestampB === timestampA ? 0 : 1
      }),
      previewArticles,
    },
  }
}
