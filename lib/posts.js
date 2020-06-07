/**
 * Static page organization
 *  **Pre-rendering**
 *
 * can be used for api or database if one query is needed and not dynamically
 * changed by user
 *
 *
 - example api:
 import fetch from 'node-fetch'

 export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch('..')
  return res.json()
}
 *
 *
 - example database
 import someDatabaseSDK from 'someDatabaseSDK'

 const databaseClient = someDatabaseSDK.createClient(...)

 export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
 *
 */

//ALL IMPORTS FOR BLOG POSTS
import fs     from 'fs';
import path   from 'path';
import matter from 'gray-matter';
import remark from 'remark';
import html   from 'remark-html';

//parsing the markdowns pages for blog
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    //Recuperation des noms de fichiers dans /posts
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map(fileName => {
        //supprimer .md des noms de fichiers pour récupérer des ids
        const id = fileName.replace(/\.md$/, '');

        //lecture des fichiers md en string
        const fullPath     = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        //gery-matter va parser les fichiers md en post metadata
        const matterResult = matter(fileContents);

        //Combine les données avec les id
        return {
            id,
            ...matterResult.data
        };
    });

    // return les posts par date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

//Static page with dynamics paths e.g.: id
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
        // Returns an array of objects that looks like this:
        // [
        //   {
        //     params: {
        //       id: 'ssg-ssr'
        //     }
        //   },
        //   {
        //     params: {
        //       id: 'pre-rendering'
        //     }
        //   }
        // ]
    });
}

export async function getPostData(id) {
    const fullPath     = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    //Use remark-html to transform md to html
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml      = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    };
}


//dynamic routes from API data:
/*
export async function getAllPostIds() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch('..')
  const posts = await res.json()
  return posts.map(post => {
    return {
      params: {
        id: post.id
      }
    }
  })
}
 */