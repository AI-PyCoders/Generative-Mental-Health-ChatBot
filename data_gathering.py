import praw
import csv
from datetime import datetime
import os
import configparser


def initialize_reddit_client():
    """
    Initialize the Reddit API client.
    """
    config = configparser.ConfigParser()
    config.read('config.ini')

    reddit = praw.Reddit(
        client_id=config['RedditAPI']['client_id'],
        client_secret=config['RedditAPI']['client_secret'],
        user_agent=config['RedditAPI']['user_agent']
    )
    return reddit


def fetch_posts_from_subreddit(subreddit_name, reddit):
    """
    Fetch posts from a given subreddit.
    """
    subreddit = reddit.subreddit(subreddit_name)
    posts = subreddit.new(limit=None)  # Fetch all posts

    # Create a set to store unique post IDs
    unique_post_ids = set()

    # Create a list to store post data for the current subreddit
    post_data = []

    count = 0
    for post in posts:
        # Check if the post ID is already in the set of unique post IDs
        if post.id not in unique_post_ids:
            author_name = post.author.name if post.author else "[Deleted]"
            created_time = datetime.fromtimestamp(
                post.created_utc).strftime('%Y-%m-%d %H:%M:%S')
            upvotes = int(post.score * post.upvote_ratio)
            downvotes = post.score - upvotes
            post_data.append([
                subreddit_name,  # Add subreddit name as a new column
                post.title,
                post.selftext,
                author_name,
                post.score,
                created_time,
                post.num_comments,
                post.url,
                post.link_flair_text,
                upvotes,  # Total upvotes
                downvotes,  # Total downvotes
                post.upvote_ratio
            ])
            # Add the post ID to the set of unique post IDs
            unique_post_ids.add(post.id)

        count += 1
        if count % 100 == 0:
            print(f"Processed {count} posts")

    print(f"Total posts fetched for r/{subreddit_name}: {count}")

    return post_data


def save_post_data_to_csv(filename, post_data):
    """
    Save post data to a CSV file.
    """
    file_exists = os.path.isfile(filename)
    with open(filename, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if not file_exists:  # Check if the file is empty
            writer.writerow(["Subreddit", "Title", "Body/Text", "Author", "Score", "Creation Time",
                             "Number of Comments", "URL", "Flair", "Upvotes", "Downvotes", "Upvote Ratio"])  # Write header
        writer.writerows(post_data)  # Write data rows


def read_subreddit_list(filename):
    """
    Read the list of subreddits from a file.
    """
    subreddits = []
    with open(filename, "r") as file:
        for line in file:
            subreddit = line.strip()
            if subreddit:
                subreddits.append(subreddit)
    return subreddits


def subreddit_data_exists(filename, subreddit_name):
    """
    Check if subreddit data already exists in the CSV file.
    """
    if not os.path.isfile(filename):
        return False

    with open(filename, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            if row and row[0] == subreddit_name:
                return True
    return False


def main():
    subreddit_list_filename = "datasets/subreddit_list.txt"
    post_data_filename = "datasets/subreddit_data.csv"

    # Initialize the Reddit API client
    reddit = initialize_reddit_client()

    # Read the list of subreddits from the file
    subreddits = read_subreddit_list(subreddit_list_filename)
    total_subreddits = len(subreddits)

    # Create a list to store all post data
    all_post_data = []

    subreddit_count = 0

    # Iterate over the subreddits and fetch post attributes
    for subreddit_name in subreddits:
        subreddit_count += 1
        if subreddit_data_exists(post_data_filename, subreddit_name):
            print(f"Skipping r/{subreddit_name} as data already exists...")
            continue

        print(
            f"Fetching posts from r/{subreddit_name}... ({subreddit_count}/{total_subreddits})")
        try:
            post_data = fetch_posts_from_subreddit(subreddit_name, reddit)
            all_post_data.extend(post_data)
            print("--------------------------------------------------")
        except Exception as e:
            if "received 404 HTTP response" in str(e):
                print(
                    f"Subreddit r/{subreddit_name} does not exist. Ignoring...")
            else:
                print(
                    f"An error occurred while fetching data from r/{subreddit_name}: {e}")
            print("--------------------------------------------------")

    remaining_subreddits = total_subreddits - subreddit_count

    # Save all the post data to the CSV file
    save_post_data_to_csv(post_data_filename, all_post_data)
    print(f"Post data saved to {post_data_filename}")

    print(
        f"Code execution completed successfully. {subreddit_count} subreddits fetched. {remaining_subreddits} subreddits remaining.")


if __name__ == "__main__":
    main()
