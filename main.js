import { stripIndents } from 'common-tags';
import LemmyBot from 'lemmy-bot';
import chalk from 'chalk';
import 'dotenv/config';

console.log(`${chalk.magenta('STARTED:')} Started Bot`)

// -----------------------------------------------------------------------------
// Data

const instances = [
    {
        name: 'programming.dev',
        communities: ['godot', 'gamedev', 'meta', 
        'programming', 'programmer_humor', 'experienced_devs', 'webdev', 
        'python', 'rust', 'csharp', 'functional_programming', 'auai', 'java', 
        'dotnet', 'cpp', 'linux', 'golang', 'neovim', 'programming_horror', 
        'learn_programming', 'powershell', 'engineering_managers', 
        'git', 'react', 'kotlin', 'commandline', 'c_lang', 'random', 'shell',
        'scala', 'latex', 'ruby', 'unity', 'vuejs', 'php', 
        'no_stupid_questions', 'android_dev', 'kubernetes', 'sveltejs', 
        'bad_ui_battles', 'privacy', 'unreal_engine', 'emacs', 'nix', 'ddd',
        'r_programming', 'loud', 'raspberry_pi', 'web_hosting', 'minecraft_dev'
        ], 
    }
]

// -----------------------------------------------------------------------------
// Main Bot Code

const allowList = instances.map((instance) => { return { instance: instance.name, communities: instance.communities } })

const bot = new LemmyBot.LemmyBot({
    instance: process.env.INSTANCE,
    credentials: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
    },
    dbFile: 'db.sqlite3',
    federation: {
        allowList: allowList
    },
    handlers: {
        post: {
            handle: async ({
                postView: {
                    post,
                    community,
                },
                botActions: { createComment, getCommunityId },
            }) => {
                if (!post.body) {
                    return;
                }

                let contentString = ""
                for (const instance of instances) {
                    for (const inst_community of instance.communities) {
                        // ignore current community
                        if (community.name === inst_community) {
                            continue;
                        }

                        if (post.body.includes(`${instance.name}/c/${inst_community}`) ||post.body.includes(`${inst_community}@${instance.name}`) || post.body.includes(`@${inst_community}@${instance.name}`) || post.body.includes(`!${inst_community}@${instance.name}`) || post.body.includes(`https://${instance.name}/c/${inst_community}`)) {
                            contentString += `- ${inst_community} - [Relative Link](/c/${inst_community}@${instance.name}) | [Direct Link](https://${instance.name}/c/${inst_community})\n`;
                        }
                    }
                }

                if (contentString.length != 0) {
                    createComment({
                        content: `
Hi! I noticed you mentioned some communities in your post[^Info]. Here are some links to them:

${contentString}
[^Info]: I am a bot, see the sections below for more info.
    ::: spoiler The relative links give you a 404
    This is typically caused by the community not being interacted with from your instance yet. To fix this you can:
    1. Go to search and switch to searching by all
    2. Search for the direct link to the community
    3. You should be able to now use a relative link to it (or it will pop up in search if you keep trying as it loads asynchonously)
    ***
    :::
    ::: spoiler How do you add / remove a community from the bot
    To add or remove communities from the bot you can create an issue on the bot's [Github Repository](https://github.com/Ategon/Lemmy-Linker-Bot/issues)
    ***
    :::
    ::: spoiler How do you trigger the bot to respond
    For example purposes lets say theres a community called \`testing\` on the instance \`programming.dev\`. All of these would work for both posts and comments:
    - \`testing@programming.dev\`
    - \`!testing@programming.dev\`
    - \`@testing@programming.dev\`
    - \`programming.dev/c/testing\`
    - \`https://programming.dev/c/testing\`

    I have added many communities to be handled to the bot by default but it is not exhaustive. If you want to add your community then see the add / remove community section.
    ***
    :::
    ::: spoiler Contact me
    Hey I'm Ategon, the bots creator. If you have any questions, comments or just want to reach out to me heres my lemmy profile with some message buttons and links to my socials [Relative Link](/u/ategon@programming.dev) | [Direct Link](https://programming.dev/u/ategon)
    ***
    :::`,
                        postId: post.id,
                    });
                }
            }
        },
        comment: {
            handle: async ({
                commentView: {
                    comment,
                    post,
                    community,
                    creator,
                },
                botActions: { createComment },
            }) => {
                if (!comment.content) {
                    return;
                }

                if(creator.bot_account) {
                    return;
                }

                let contentString = ""
                for (const instance of instances) {
                    for (const inst_community of instance.communities) {
                        if (comment.content.includes(`${instance.name}/c/${inst_community}`) || comment.content.includes(`${inst_community}@${instance.name}`) || comment.content.includes(`@${inst_community}@${instance.name}`) || comment.content.includes(`!${inst_community}@${instance.name}`) || comment.content.includes(`https://${instance.name}/c/${inst_community}`)) {
                            contentString += `- ${inst_community} - [Relative Link](/c/${inst_community}@${instance.name}) | [Direct Link](https://${instance.name}/c/${inst_community})\n`;
                        }
                    }
                }

                if (contentString.length != 0) {
                    createComment({
                        content: `
Hi! I noticed you mentioned some communities in your comment[^Info]. Here are some links to them:

${contentString}
[^Info]: I am a bot, see the sections below for more info.
    ::: spoiler The relative links give you a 404
    This is typically caused by the community not being interacted with from your instance yet. To fix this you can:
    1. Go to search and switch to searching by all
    2. Search for the direct link to the community
    3. You should be able to now use a relative link to it (or it will pop up in search if you keep trying as it loads asynchonously)
    ***
    :::
    ::: spoiler How do you add / remove a community from the bot
    To add or remove communities from the bot you can create an issue on the bot's [Github Repository](https://github.com/Ategon/Lemmy-Linker-Bot/issues)
    ***
    :::
    ::: spoiler How do you trigger the bot to respond
    For example purposes lets say theres a community called \`testing\` on the instance \`programming.dev\`. All of these would work for both posts and comments:
    - \`testing@programming.dev\`
    - \`!testing@programming.dev\`
    - \`@testing@programming.dev\`
    - \`programming.dev/c/testing\`
    - \`https://programming.dev/c/testing\`

    I have added many communities to be handled to the bot by default but it is not exhaustive. If you want to add your community then see the add / remove community section.
    ***
    :::
    ::: spoiler Contact me
    Hey I'm Ategon, the bots creator. If you have any questions, comments or just want to reach out to me heres my lemmy profile with some message buttons and links to my socials [Relative Link](/u/ategon@programming.dev) | [Direct Link](https://programming.dev/u/ategon)
    ***
    :::`,
                        postId: post.id,
                        parentId: comment.id,
                    });
                }
            }
        }
    },
});

bot.start();