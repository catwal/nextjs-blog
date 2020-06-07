import Layout                       from '../../components/layout';
import {getAllPostIds, getPostData} from '../../lib/posts';
import Head                         from 'next/head';
import Date                         from '../../components/date';
import utilStyles                   from '../../styles/utils.module.css';

export default function Post({postData}) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
            {postData.id}

                <h1 className={utilStyles.heading2Xl}>{postData.title}</h1>
                {/*
                  comment are inside this
                  {postData.date}
                 */}
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{__html: postData.contentHtml}} />
            </article>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false
    };
}

export async function getStaticProps({params}) {
    const postData = await getPostData(params.id);
    return {
        props: {
            postData
        }
    };
}