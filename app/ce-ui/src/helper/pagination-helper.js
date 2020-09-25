export function defaultPageSize(data, preferred_max) {
    
    //console.info("defaultPageSize DATA", data)

    if (data === undefined || data === null) {
        return 10
    }
    var page_size = preferred_max;
    if (data.length < preferred_max) {
        page_size = data.length
    }
    return page_size
}

export function pageSizeOptions(data) {
    
    //console.info("pageSizeOptions DATA", data)

    if (data === undefined || data === null) {
        return [12,50,100,1000]
    }

    var page_sizes = []

    if (data.length > 12) {
        page_sizes.push(12);
    }

    if (data.length > 25) {
        page_sizes.push(25);
    }

    if (data.length > 50) {
        page_sizes.push(50);
    }

    if (data.length > 100) {
        page_sizes.push(100);
    }    

    page_sizes.push(data.length);

    return page_sizes
}