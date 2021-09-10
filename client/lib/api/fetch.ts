import { ResultsObject } from '@interfaces/Search'

export const fetchEndpoint = async (url: string, query: string): Promise<Response | null> => {
    const queryOptions = {
        query
    }
    const defaultOptions = {
        method: 'POST',
        body: JSON.stringify(queryOptions)
    }
    const response = await fetch(url, defaultOptions)
    if (!response.ok) {
        console.error(response.statusText);
        console.error(response.status)
        throw new Error(`Failed to fetch API: ${url}`);
    }
    
    return response
}
  
export const fetchResults = async (url: string, query: string): Promise<ResultsObject[] | null> => {
        const response = await fetchEndpoint(url, query)
            .catch(error => {
                console.error(error)
                throw new Error('Failed to fetch API')
            })
            if (response) {
                return await response.json() as ResultsObject[]
            }
            
        return null
}