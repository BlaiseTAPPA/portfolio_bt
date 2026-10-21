import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Tags } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { formatDate, posts } from "@/lib/content";
import { contentImage, pageMetadata, postJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map(({ slug }) => ({ locale, slug })));
}

type Props = PageProps<"/[locale]/blog/[slug]">;

async function resolvePost(params: Props["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return { locale, post };
}

export async function generateMetadata({ params }: Props) {
  const { locale, post } = await resolvePost(params);
  return pageMetadata({
    locale,
    path: `/blog/${post.slug}`,
    title: `${post.title[locale]} | Blaise Tappa`,
    description: post.excerpt[locale],
    image: contentImage(post.image),
    type: "article",
    publishedTime: post.date,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale: lang, post } = await resolvePost(params);
  const t = await getTranslations("common");

  return (
    <article className="pt-36 pb-24 md:pt-44">
      <JsonLd data={postJsonLd(post, lang)} />
      <div className="shell">
        <div className="mx-auto max-w-[680px]">
          <Link href="/blog" className="link-mono">
            {t("backToBlog")}
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="caption-mono">{formatDate(post.date, lang)}</span>
            <Tags items={post.tags[lang]} />
          </div>
          <h1 className="display-lg mt-6">{post.title[lang]}</h1>
        </div>
      </div>

      <div className="shell mt-14">
        <div className="mx-auto max-w-[680px]">
          <Image
            src={post.image}
            alt=""
            aria-hidden="true"
            width={1600}
            height={912}
            sizes="(min-width: 768px) 680px, calc(100vw - 48px)"
            className="h-auto w-full object-cover"
          />
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
  );
}
