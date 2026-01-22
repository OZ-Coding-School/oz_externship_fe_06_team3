const Loading = () => {
  return (
    <div className="loading-dots" aria-label="loading" role="status">
      <svg className="loading-dot" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill="#6201E0" />
      </svg>
      <svg className="loading-dot" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill="#6201E0" />
      </svg>
      <svg className="loading-dot" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill="#6201E0" />
      </svg>
    </div>
  )
}

export default Loading
