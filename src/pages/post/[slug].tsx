/* eslint-disable prefer-const */
import { useEffect } from 'react';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    let script = document.createElement('script');
    let anchor = document.getElementById('inject-comments-for-utterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute(
      'repo',
      'viniciusmendite/ignite-spacetraveling-utterances-app'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'photon-dark');
    anchor.appendChild(script);
  }, []);

  const time = Math.ceil(
    RichText.asText(post.data.content[0].body).split(' ').length / 200
  );

  // const time = post.data.content.reduce((acc, item) => {
  //   return Math.ceil(RichText.asText(item.body).split(' ').length / 2);
  // }, 0);

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Header />
      <main>
        <div className={styles.banner}>
          <img src={post.data.banner.url} alt="" />
        </div>

        <div className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.infoContainer}>
            <span>
              <FiCalendar size={20} />
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </span>
            <span>
              <FiUser size={20} />
              {post.data.author}
            </span>
            <span>
              <FiClock size={20} />
              {time * 4} min
            </span>
          </div>
          <span className={styles.lastPublication}>
            {format(
              new Date(post.last_publication_date),
              "'*editado em' dd MMM yyyy', às' kk:mm",
              {
                locale: ptBR,
              }
            )}
          </span>

          {post.data.content.map(c => (
            <div key={c.heading}>
              <h2>{c.heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(c.body) }}
              />
            </div>
          ))}

          {/* <h2>{post.data.content[0].heading}</h2>
          <div dangerouslySetInnerHTML={{ __html: text }} />
          <h2>{post.data.content[0].heading} asd</h2>
          <div dangerouslySetInnerHTML={{ __html: text }} /> */}

          {/* <div
            dangerouslySetInnerHTML={{
              __html: RichText.asHtml(post.data.content.body),
            }}
          /> */}
        </div>
        <hr className={styles.divisor} />
        <div className={styles.actions}>
          <Link href="">
            <a>
              <span>Como utilizar Hooks</span>
              Post anterior
            </a>
          </Link>
          <Link href="">
            <a>
              <span>Criando um app CRA do Zero</span>
              Próximo post
            </a>
          </Link>
        </div>
        <div id="inject-comments-for-utterances" />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts')
  );

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      author: response.data.author,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(c => {
        return {
          heading: c.heading,
          body: c.body,
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
