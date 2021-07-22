import { GetStaticProps } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Header />
      <main className={styles.mainContainer}>
        <a href="/" className={styles.postCard}>
          <h2>Como utitlizar Hooks</h2>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>

          <div className={styles.infoContainer}>
            <span>
              <FiCalendar size={20} />
              15 Mar 2021
            </span>
            <span>
              <FiUser size={20} />
              Vinícius Mendite
            </span>
          </div>
        </a>
        <a href="/" className={styles.postCard}>
          <h2>Como utitlizar Hooks</h2>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>

          <div className={styles.infoContainer}>
            <span>
              <FiCalendar size={20} />
              15 Mar 2021
            </span>
            <span>
              <FiUser size={20} />
              Vinícius Mendite
            </span>
          </div>
        </a>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
