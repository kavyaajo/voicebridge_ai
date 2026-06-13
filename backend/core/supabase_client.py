import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Fallback to dummy values if variables aren't found (e.g., during GitHub Action checks)
if not SUPABASE_URL or not SUPABASE_KEY:
    SUPABASE_URL = "https://placeholder-url.supabase.co"
    SUPABASE_KEY = "placeholder-key-string"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("supabase url:", SUPABASE_URL)
# Safe print to avoid index errors if the string is empty or short
print("supabase key starts with:", str(SUPABASE_KEY)[:20])