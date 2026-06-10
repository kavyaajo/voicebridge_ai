from core.supabase_client import supabase
response = supabase.table("core_user").select("*").execute()
print(response.data)
