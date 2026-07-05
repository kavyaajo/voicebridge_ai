import { useState } from "react";

export default function Agent() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/agent/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Something went wrong.");
      console.error(error);
    }

    setLoading(false);
  };

 return (
  <div
    style={{
      maxWidth: "800px",
      margin: "50px auto",
      padding: "30px",
      background: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    }}
  > 
      <h1>VoiceBridge AI Assistant</h1> 

      <textarea
        rows="6"
        placeholder="Ask about previous meetings or generate a follow-up email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
        }}
      />

     <button
  onClick={handleSubmit}
  disabled={loading}
  style={{
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  {loading ? "🤖 Thinking..." : "🚀 Ask AI"}
</button>

      {response && (
        <div
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            whiteSpace: "pre-wrap",
            lineHeight: "1.7",
          }}
        >
          <h3
            style={{
              color: "#2563eb",
              marginBottom: "15px",
            }}
          >
            🤖 AI Response
          </h3>

          <div>{response}</div>
        </div>
      )}
    </div>
  );
}