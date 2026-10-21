import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHeader, Tags } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { formatDate, posts } from "@/lib/content";
import { contentImage, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.blog" });
  return pageMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
    image: contentImage("/images/post-gemini.jpg"),
  });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const lang = await resolveLocale(params);
  const t = await getTranslations("common");

  return (
    <>
      <PageHeader title={t("navBlog")} intro={t("blogIntro")} />

      <section className="section-y">
        <div className="shell grid gap-16 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-video overflow-hidden bg-surface-soft">
                  <Image
                    src={post.image}
                    alt=""
                    aria-hidden="true"
                    width={1600}
                    height={912}
                    sizes="(min-width: 1280px) 580px, (min-width: 768px) 45vw, 100vw"
                    className="size-full object-cover opacity-75 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <p className="caption-mono mt-6">{formatDate(post.date, lang)}</p>
                <h2 className="title-md mt-3">{post.title[lang]}</h2>
                <p className="body-sm mt-3">{post.excerpt[lang]}</p>
                <div className="mt-5">
                  <Tags items={post.tags[lang]} />
                </div>
                <span className="link-mono mt-5 inline-block">{t("readArticle")}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
