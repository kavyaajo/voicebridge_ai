import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Fallback to dummy values if variables aren't found in the environment
if not SUPABASE_URL or not SUPABASE_KEY:
    SUPABASE_URL = "https://placeholder-url.supabase.co"
    # A structurally valid mock JWT token format that satisfies Supabase validation
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE1Nzg0Mzg0MDAsImV4cCI6NjMwNzIwMDAwMH0.placeholder-signature"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("supabase url:", SUPABASE_URL)
print("supabase key starts with:", str(SUPABASE_KEY)[:20])