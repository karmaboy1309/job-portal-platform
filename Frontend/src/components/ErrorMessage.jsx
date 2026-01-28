const ErrorMessage = ({ message }) => {
  return (
    <div style={{
      backgroundColor: "#ffe5e5",
      color: "#b00020",
      padding: "12px",
      borderRadius: "6px",
      margin: "10px 0",
      textAlign: "center",
      fontWeight: "500"
    }}>
      {message || "Something went wrong"}
    </div>
  );
};


export default ErrorMessage;
