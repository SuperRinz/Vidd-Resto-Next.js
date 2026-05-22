from supabase import create_client

def get_supabase_client():
    url = "https://nmnnaisnckxbvyhlesfn.supabase.co"
    key = "sb_publishable_nRDlPpPWpJRj1MELhIURKQ_EMZF9cNz"

    return create_client(url, key)