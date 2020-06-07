import Link from 'next/link';
import Head   from 'next/head';
import Layout from '../../components/layout';


export default function FirstPost() {
    return (
        <Layout>
            <Head>
                <title> First Post</title>
            </Head>
            <h2>
                <Link href="/">
                    <a>Go back to Home</a>
                </Link>
            </h2>
        </Layout>
    );
}