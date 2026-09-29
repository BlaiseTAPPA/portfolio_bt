import { Link } from "react-router-dom";
import { Page, PageHeader, Tags } from "@/components/site-chrome";
import { formatDate, posts } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function BlogPage() {
  const { t, lang } = useLang();

  return (
    <Page>
      <PageHeader title={t("navBlog")} intro={t("blogIntro")} />

      <section className="section-y">
        <div className="shell grid gap-16 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-video overflow-hidden bg-surface-soft">
                  <img
                    src={post.image}
                    alt=""
                    aria-hidden="true"
                    className="size-full object-cover opacity-75 transition-opacity duration-500 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>
                <p className="caption-mono mt-6">{formatDate(post.date, lang)}</p>
                <h2 className="title-md mt-3">{post.title[lang]}</h2>
                <p className="body-sm mt-3">{post.excerpt[lang]}</p>
                <div className="mt-5">
                  <Tags items={post.tags} />
                </div>
                <span className="link-mono mt-5 inline-block">{t("readArticle")}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
