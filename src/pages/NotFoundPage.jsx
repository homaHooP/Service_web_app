function NotFound({message}) {
    return (
        <>
            {message?
                (<div className="error"><h1 className="error-message">{message}</h1></div>):
                (<div className="error"><h1 className="error-message">Page not found</h1> <p className="error-code">Error code: 404</p></div>)
            }
        </>
    )
}

export default NotFound
