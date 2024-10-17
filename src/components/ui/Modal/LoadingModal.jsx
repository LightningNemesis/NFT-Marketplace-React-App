export const LoadingModal = ({ status }) => {
  return (
    <div className="loading-modal">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>{status}</p>
      </div>
    </div>
  );
};
