import React from "react";


export function RedictUrl() {



    React.useEffect(() => {
        var url = new URL(window.location.href);
        var u = url.searchParams.get("url");
        if (u) {
            u = decodeURIComponent(u);
            location.href = u;
        }
    }, [])

    return <div></div>
}