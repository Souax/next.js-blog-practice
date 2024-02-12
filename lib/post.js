import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//全てのディレクトリーの中のpostsファイルのパスを取得
const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルのデータを取り出す
export function getPostsData() {
    //オブジェクトの配列として持つ
    const fileNames = fs.readdirSync(postsDirectory);
    //1つずつ取り出す
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, ""); //ファイル名(id)
        //文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);
        //idとデータを返す
        return {
            id,
            ...matterResult.data,
        };
    });
    return allPostsData;
}


//getStatuicPathをreturnで使うpathを取得する
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return{
            params: {
                id: fileName.replace(/\.md$/, "")
            },
        };
    });
}


//idに基づいてブログ投稿データを返す
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    const blogContent = await remark().use(html).process(matterResult.content);
    //String型にする
    const blogContentHTML = blogContent.toString();

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}