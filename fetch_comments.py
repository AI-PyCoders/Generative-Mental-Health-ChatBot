import pandas as pd
import praw
import configparser
from datetime import datetime


def initialize_reddit_client():
    # Initialize the Reddit API client.
    config = configparser.ConfigParser()
    config.read('config.ini')
    reddit = praw.Reddit(
        client_id=config['RedditAPI']['client_id'],
        client_secret=config['RedditAPI']['client_secret'],
        user_agent=config['RedditAPI']['user_agent']
    )
    return reddit


def fetch_posts_from_subreddit(subreddit_name, reddit):
    # Number of submissions to fetch in each batch
    batch_size = 10

    subreddit = reddit.subreddit(subreddit_name)
    posts = subreddit.new(limit=None)  # Fetch all posts

    # Create a set to store unique post IDs
    unique_post_ids = set()

    # Create a list to store post data for the current subreddit
    post_data = []

    posts_count = 0
    comments_count = 0

    for submission in posts:
        # Skip posts with no comments
        if submission.num_comments == 0:
            continue

        post_id = submission.id
        post_title = submission.title
        post_body = submission.selftext
        flair = submission.link_flair_text

        if submission.id not in unique_post_ids:
            unique_post_ids.add(submission.id)
            submission.comments.replace_more(limit=None)
            comments = submission.comments.list()
            def score(c): return c.score
            top_comments = sorted(comments, key=score, reverse=True)[:3]

            for comment in top_comments:
                comment_body = comment.body
                upvotes = comment.ups
                downvotes = comment.downs
                comment_created = datetime.fromtimestamp(
                    comment.created_utc).strftime('%Y-%m-%d %H:%M:%S')
                post_data.append((post_id, subreddit_name, post_title, post_body,
                                 comment_body, upvotes, downvotes, comment_created, flair))
                comments_count += 1

        posts_count += 1
        print(f"Processed {posts_count} posts with {comments_count} comments.")
        comments_count = 0

        # Save the data to the CSV file after every batch_size submissions
        if posts_count % batch_size == 0:
            df = pd.DataFrame(post_data, columns=['Post_Id', 'Subreddit', 'Post_Title', 'Post_Body', 'Comment',
                                                  'Upvotes', 'Downvotes', 'Comment_Created', 'Flair'])
            df.to_csv('datasets/reddit_data/reddit_comments.csv', mode='a', index=False,
                      header=posts_count < batch_size+1)
            post_data = []  # Reset the data list

    print(f"Total posts fetched for r/{subreddit_name}: {posts_count}")
    return post_data


def read_subreddit_list(filename):
    # Read the list of subreddits from a file.
    subreddits = []
    with open(filename, "r") as file:
        for line in file:
            subreddit = line.strip()
            if subreddit:
                subreddits.append(subreddit)
    return subreddits


def main():
    subreddit_list_filename = "datasets/reddit_data/subreddit_list.txt"

    # Initialize the Reddit API client
    reddit = initialize_reddit_client()

    # Read the list of subreddits from the file
    subreddits = read_subreddit_list(subreddit_list_filename)
    total_subreddits = len(subreddits)

    subreddit_count = 0

    # Iterate over the subreddits and fetch post attributes
    for subreddit_name in subreddits:
        subreddit_count += 1
        print(
            f"Fetching posts from r/{subreddit_name}...({subreddit_count}/{total_subreddits})")
        try:
            fetch_posts_from_subreddit(subreddit_name, reddit)
        except Exception as e:
            if "received 404 HTTP response" in str(e):
                print(
                    f"Subreddit r/{subreddit_name} does not exist. Ignoring...")
            else:
                print(
                    f"An error occurred while fetching data from r/{subreddit_name}: {e}")
            print("--------------------------------------------------")


if __name__ == "__main__":
    main()
