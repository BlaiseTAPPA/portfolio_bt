import { useParams, Link } from "react-router-dom";
import { Page, Tags } from "@/components/site-chrome";
import { formatDate, posts } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Page>
        <section className="section-y">
          <div className="shell text-center py-20">
            <h1 className="display-lg">Article not found</h1>
            <p className="body-md mt-4 text-muted">The requested blog post could not be found.</p>
            <Link to="/blog" className="btn-outline mt-8 inline-block">
              {t("backToBlog")}
            </Link>
          </div>
        </section>
      </Page>
    );
  }

  return (
    <Page>
      <article className="pt-36 pb-24 md:pt-44">
        <div className="shell">
          <div className="mx-auto max-w-[680px]">
            <Link to="/blog" className="link-mono">
              {t("backToBlog")}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="caption-mono">{formatDate(post.date, lang)}</span>
              <Tags items={post.tags} />
            </div>
            <h1 className="display-lg mt-6">{post.title[lang]}</h1>
          </div>
        </div>

        <div className="shell mt-14">
          <div className="mx-auto max-w-[680px]">
            <img src={post.image} alt="" aria-hidden="true" className="w-full object-cover" />
            <div className="mt-14 space-y-7">
              {post.body[lang].slice(0, 2).map((para) => (
                <p key={para} className="body-md">
                  {para}
                </p>
              ))}
              <blockquote className="border-l border-hairline-strong py-2 pl-6">
                <p className="body-md text-body-strong text-xl italic">{post.quote[lang]}</p>
              </blockquote>
              {post.body[lang].slice(2).map((para) => (
                <p key={para} className="body-md">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Page>
  );
}
