const EmptyState = ({ message }) => {
  return (
    <div style={{
      padding: "30px",
      textAlign: "center",
      color: "#999",
      fontSize: "18px"
    }}>
      {message || "No jobs available"}
    </div>
  );
};


export default EmptyState;
