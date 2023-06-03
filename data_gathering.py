import requests
import pandas as pd
from datetime import datetime

def fetch_posts(subreddit):
    base_url = 'https://api.reddit.com'
    endpoint = f'{base_url}/r/{subreddit}/new'
    headers = {'User-Agent': 'Capstone Project/0.0.1 (by xxmukulxx)'}
    params = {'limit': 100}
    unique_posts = []
    seen_posts = set()
    while len(unique_posts) < 10000:  # Fetch 10,000 unique posts from one subreddit
        response = requests.get(endpoint, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            posts = data['data']['children']
            for post in posts:
                post_id = post['data']['id']
                if post_id in seen_posts:
                    # Break the loop when posts start repeating
                    print('Posts started repeating. Breaking the loop.')
                    return unique_posts
                post_data = {
                    'Post ID': post_id,
                    'Title': post['data']['title'],
                    'Author': post['data']['author'],
                    'Score': post['data']['score'],
                    'Num Comments': post['data']['num_comments'],
                    'URL': post['data']['url'],
                    'Formatted Date': datetime.fromtimestamp(post['data']['created_utc']).strftime('%Y-%m-%d %H:%M:%S'),
                    'Upvotes': post['data']['ups'],
                    'Body': post['data']['selftext'],
                    'Flair': post['data']['link_flair_text'],
                    'Subreddit': subreddit  # Type of subreddit
                }
                unique_posts.append(post_data)
                seen_posts.add(post_id)
                print(f'Post ID: {post_id} | Formatted Date: {post_data["Formatted Date"]} | Subreddit: {subreddit}')
            # Update the after parameter to fetch the next page of results
            params['after'] = data['data']['after']
        else:
            print('Error:', response.status_code,response.json())
            break
    return unique_posts


def save_to_csv(posts):
    filename = 'mental_health_posts.csv'
    cols = ['Post ID', 'Title', 'Author', 'Score', 'Num Comments', 'URL', 'Formatted Date', 'Upvotes', 'Body', 'Flair', 'Subreddit']
    df = pd.DataFrame(posts, columns=cols)
    df.to_csv(filename, index=False)
    print(f'Saved {len(posts)} unique posts to {filename}.')

if __name__ == '__main__':
    subreddits = ['mentalhealth', 'anxiety', 'depression', 'suicidewatch', 'ADHD', 'bipolar', 'ptsd','OCD','socialanxiety','insomnia']
    posts = []
    for subreddit in subreddits:
        subreddit_posts = fetch_posts(subreddit)
        posts.extend(subreddit_posts)
    save_to_csv(posts)