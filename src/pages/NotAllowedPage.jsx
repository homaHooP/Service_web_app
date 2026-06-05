function NotAllowed() {
    return (
        <>
            <div className="error">
                <h1 className="error-message">Access denied (no rights)</h1>
                <p className="error-code">Error code: 401</p>
            </div>
        </>
    )
}

export default NotAllowed
