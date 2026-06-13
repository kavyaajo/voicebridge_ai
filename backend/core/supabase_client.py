import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Fallback to dummy values if variables aren't found (like during GitHub Action checks)
if not SUPABASE_URL or not SUPABASE_KEY:
    SUPABASE_URL = "https://placeholder-url.supabase.co"
    SUPABASE_KEY = "placeholder-key-string"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)