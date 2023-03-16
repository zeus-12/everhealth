export const getParsedData = (data: string) => {
    try {
        const parsedData = JSON.parse(data) || []
        return parsedData
    }
    catch (err) {
        console.log("Error parsing data:", err.message)
        return null
    }
}