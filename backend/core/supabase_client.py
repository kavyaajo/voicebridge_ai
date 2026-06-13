from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("supabase url:", SUPABASE_URL)
print("supabase key starts with:", SUPABASE_KEY[:20])  # Print first 20 characters
